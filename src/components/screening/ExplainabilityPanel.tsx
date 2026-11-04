import { useState } from 'react'
import { Focus, Info } from 'lucide-react'
import { clsx } from 'clsx'
import type { ExplanationData } from '../../types/screening'

export function ExplainabilityPanel({
  isDemo = true,
  explanation,
  modelVersion,
}: {
  isDemo?: boolean
  explanation?: ExplanationData | null
  modelVersion?: string
}) {
  const [view, setView] = useState<'original' | 'heatmap'>('original')
  const isEmbeddedImage = (source: string) => /^data:image\/(png|jpeg);base64,/.test(source)
  const genuine =
    !isDemo &&
    explanation?.method === 'GRAD_CAM' &&
    explanation.model_version === modelVersion &&
    isEmbeddedImage(explanation.original_image) &&
    isEmbeddedImage(explanation.heatmap_image)
  return (
    <section className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center gap-2">
        <Focus className="size-4 text-primary" />
        <h3 className="text-[13px] font-semibold">Understanding the output</h3>
      </div>
      {genuine && explanation ? (
        <div className="mt-4">
          <div role="group" aria-label="Retinal explanation image view" className="flex gap-2">
            {(['original', 'heatmap'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => setView(option)}
                className={clsx(
                  'min-h-9 rounded-lg border px-3 text-[10px] font-medium',
                  view === option ? 'border-primary bg-primary-light text-primary' : 'border-border text-muted-foreground',
                )}
              >
                {option === 'original' ? 'Original image' : 'Actual Grad-CAM'}
              </button>
            ))}
          </div>
          <img
            src={view === 'original' ? explanation.original_image : explanation.heatmap_image}
            alt={
              view === 'original'
                ? 'Original source retinal research image'
                : 'Actual model-generated Grad-CAM activation overlay, not a diagnosis'
            }
            className="mt-3 max-h-72 w-full rounded-lg bg-foreground object-contain"
          />
          <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
            Actual Grad-CAM · {explanation.model_version}. Activations describe model attention, not lesion evidence or a validated causal
            explanation.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-semibold">
                {isDemo ? 'No genuine model explanation is available' : 'Grad-CAM is not enabled for this model'}
              </p>
              <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                {isDemo
                  ? 'The demo model has not learned retinal features. We do not fabricate heatmaps or imply that it has identified lesions.'
                  : 'A trained model does not automatically provide a validated explanation. No compatible activation heatmap has been provided by this service.'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
            A future authenticated research integration can provide genuine Grad-CAM activations. Original/heatmap controls appear only when
            actual, model-version-matched image data is returned. A heatmap is not a diagnosis.
          </p>
          <span className="mt-3 inline-flex rounded border border-border px-2 py-1 text-[8px] font-medium text-muted-foreground">
            ILLUSTRATIVE EXPLANATION · NO HEATMAP
          </span>
        </>
      )}
    </section>
  )
}
