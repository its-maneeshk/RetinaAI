import { LockKeyhole, ClipboardList } from 'lucide-react'
import type { CaseMetadata } from '../../types/screening'
const inputClass =
  'mt-2 min-h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-muted'
export function CaseMetadataForm({
  value,
  onChange,
  disabled,
}: {
  value: CaseMetadata
  onChange: (value: CaseMetadata) => void
  disabled: boolean
}) {
  function update(key: keyof CaseMetadata, text: string) {
    onChange({ ...value, [key]: text })
  }
  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <ClipboardList className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Case information</h2>
        <span className="ml-auto text-[10px] text-muted-foreground">01</span>
      </div>
      <fieldset disabled={disabled} className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <legend className="sr-only">Synthetic screening case metadata</legend>
        <label htmlFor="case-id" className="text-[11px] font-medium">
          Case ID<span className="ml-1 text-[9px] font-normal text-muted-foreground">Auto-generated</span>
          <input id="case-id" value={value.case_id} readOnly className={`${inputClass} bg-muted! font-mono text-muted-foreground!`} />
        </label>
        <label htmlFor="patient-reference" className="text-[11px] font-medium">
          Synthetic patient reference <span className="text-primary">*</span>
          <input
            id="patient-reference"
            required
            pattern="SYN-[A-Za-z0-9-]{2,32}"
            title="Use a synthetic reference starting with SYN-, for example SYN-001"
            maxLength={36}
            value={value.patient_reference}
            onChange={(e) => update('patient_reference', e.target.value)}
            placeholder="e.g. SYN-001"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label htmlFor="age" className="text-[11px] font-medium">
          Age<span className="ml-1 text-[9px] font-normal text-muted-foreground">Optional</span>
          <input
            id="age"
            type="number"
            min="0"
            max="120"
            step="1"
            value={value.age}
            onChange={(e) => update('age', e.target.value)}
            placeholder="Age in years"
            className={inputClass}
          />
        </label>
        <label htmlFor="screening-date" className="text-[11px] font-medium">
          Screening date <span className="text-primary">*</span>
          <input
            id="screening-date"
            type="date"
            required
            value={value.screening_date}
            onChange={(e) => update('screening_date', e.target.value)}
            className={inputClass}
          />
        </label>
        <label htmlFor="eye" className="text-[11px] font-medium sm:col-span-2">
          Eye
          <select id="eye" value={value.eye} onChange={(e) => update('eye', e.target.value)} className={inputClass}>
            <option value="UNSPECIFIED">Not specified</option>
            <option value="LEFT">Left eye (OS)</option>
            <option value="RIGHT">Right eye (OD)</option>
          </select>
        </label>
      </fieldset>
      <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-5 text-muted-foreground">
        <LockKeyhole className="mt-0.5 size-3 shrink-0" />
        Use synthetic references only. Do not enter real names or identifying information.
      </p>
    </section>
  )
}
