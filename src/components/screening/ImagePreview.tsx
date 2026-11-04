import { useEffect, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
export function ImagePreview({ file, onRemove, disabled }: { file: File; onRemove: () => void; disabled?: boolean }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex h-56 items-center justify-center bg-[#0d2920] p-4">
        {url && (
          <img
            src={url}
            alt="Selected synthetic retinal fundus image for technical validation"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        )}
      </div>
      <div className="flex items-center gap-2 bg-white p-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <Check className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium">{file.name}</p>
          <p className="mt-1 text-[9px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · Private upload</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Remove uploaded image"
          className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
