import { useRef, useState } from 'react'
import { UploadCloud, ImagePlus, ArrowDownToLine, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { ImagePreview } from './ImagePreview'
import { errorMessage } from '../../services/api'
export function ImageUpload({ file, onFile, disabled }: { file: File | null; onFile: (file: File | null) => void; disabled: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sampleError, setSampleError] = useState<string | null>(null)
  async function useSample() {
    setLoading(true)
    setSampleError(null)
    try {
      const response = await fetch('/images/retina-demo.png')
      if (!response.ok) throw new Error('The sample illustration could not be loaded. Please upload a synthetic image.')
      const blob = await response.blob()
      onFile(new File([blob], 'synthetic-retina-demo.png', { type: 'image/png' }))
    } catch (error: unknown) {
      setSampleError(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <ImagePlus className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Retinal image</h2>
        <span className="ml-auto text-[10px] text-muted-foreground">02</span>
      </div>
      <input
        ref={input}
        id="retinal-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        className="hidden"
        aria-label="Choose a synthetic retinal fundus image"
        onChange={(event) => {
          onFile(event.target.files?.[0] ?? null)
          event.target.value = ''
        }}
      />
      {file ? (
        <ImagePreview file={file} onRemove={() => onFile(null)} disabled={disabled} />
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDrag(false)
            if (!disabled && event.dataTransfer.files[0]) onFile(event.dataTransfer.files[0])
          }}
          className={clsx(
            'flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-7 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
            drag ? 'border-primary bg-primary-light' : 'border-primary/30 bg-[#f8fbf9] hover:border-primary hover:bg-primary-light/50',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-white text-primary shadow-xs">
            <UploadCloud className="size-6" strokeWidth={1.5} />
          </span>
          <span className="text-xs font-medium">Drop your retinal image here</span>
          <span className="-mt-1 text-[10px] text-muted-foreground">
            or <span className="font-semibold text-primary underline underline-offset-4">browse files</span> to upload
          </span>
          <span className="mt-2 text-[9px] text-muted-foreground">JPEG, PNG, WebP · Up to 10 MB · Min. 224 × 224 px</span>
        </button>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] text-muted-foreground">Just exploring?</p>
        <button
          type="button"
          onClick={() => void useSample()}
          disabled={disabled || loading}
          className="flex min-h-9 items-center gap-1.5 text-[10px] font-semibold text-primary disabled:opacity-40"
        >
          <ArrowDownToLine className="size-3" />
          {loading ? 'Loading illustration…' : 'Use a synthetic sample'}
        </button>
      </div>
      {sampleError && (
        <p role="alert" className="text-xs text-destructive">
          {sampleError}
        </p>
      )}
      <p className="mt-1 flex gap-1.5 border-t border-border pt-3 text-[9px] leading-5 text-muted-foreground">
        <ShieldCheck className="mt-1 size-3 shrink-0" />
        Images are validated on the server and never served as public files.
      </p>
    </section>
  )
}
