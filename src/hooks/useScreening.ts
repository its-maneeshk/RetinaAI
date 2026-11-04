import { useEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { analyzeImage, saveScreening } from '../services/screeningService'
import { ApiError, errorMessage } from '../services/api'
import { createMetadata, validateImage } from '../utils/imageValidation'
import type { CaseMetadata, ScreeningRecord } from '../types/screening'

export function useScreening() {
  const [metadata, setMetadata] = useState<CaseMetadata>(createMetadata)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ScreeningRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [consent, setConsent] = useState(false)
  const [imageRejected, setImageRejected] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const generation = useRef(0)
  const { mutate } = useSWRConfig()
  useEffect(
    () => () => {
      controller.current?.abort()
      generation.current += 1
    },
    [],
  )
  function cancel() {
    controller.current?.abort()
    generation.current += 1
    setAnalyzing(false)
  }
  function updateMetadata(value: CaseMetadata) {
    setImageRejected(false)
    setMetadata(value)
    setResult(null)
    setError(null)
  }
  function chooseFile(value: File | null) {
    cancel()
    setImageRejected(false)
    setResult(null)
    const validation = value ? validateImage(value) : null
    setError(validation)
    setFile(validation ? null : value)
  }
  function reset() {
    cancel()
    setImageRejected(false)
    setMetadata(createMetadata())
    setFile(null)
    setResult(null)
    setError(null)
    setConsent(false)
    setSaving(false)
  }
  async function analyze() {
    if (!file || !consent || analyzing) return
    const id = ++generation.current
    controller.current = new AbortController()
    setAnalyzing(true)
    setImageRejected(false)
    setError(null)
    setResult(null)
    try {
      const response = await analyzeImage(file, metadata, controller.current.signal)
      if (id === generation.current) setResult(response)
    } catch (caught: unknown) {
      if (id === generation.current) {
        setError(errorMessage(caught))
        setImageRejected(caught instanceof ApiError && [413, 415, 422].includes(caught.status))
      }
    } finally {
      if (id === generation.current) setAnalyzing(false)
    }
  }
  async function save() {
    if (!result || result.is_saved || saving) return
    const id = generation.current
    setSaving(true)
    setError(null)
    try {
      const saved = await saveScreening(result.record_id)
      if (id === generation.current) setResult(saved)
      await mutate((key) => typeof key === 'string' && (key.startsWith('/dashboard') || key.startsWith('/screening/history')))
    } catch (caught: unknown) {
      if (id === generation.current) setError(errorMessage(caught))
    } finally {
      if (id === generation.current) setSaving(false)
    }
  }
  return {
    metadata,
    updateMetadata,
    file,
    chooseFile,
    result,
    error,
    analyzing,
    saving,
    consent,
    setConsent,
    analyze,
    save,
    reset,
    cancel,
    imageRejected,
  }
}
