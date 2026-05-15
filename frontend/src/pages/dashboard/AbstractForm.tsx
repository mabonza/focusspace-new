import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Save, Send, Paperclip, X, FileText } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { createAbstract, updateAbstract, getAbstractById } from '../../services/abstracts'
import { getConferences } from '../../services/strapi'
import { abstractSchema, type AbstractInput } from '../../lib/schemas'
import Button from '../../components/Button'
import type { Conference } from '../../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

async function uploadFile(token: string, file: File): Promise<number> {
  const form = new FormData()
  form.append('files', file)
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) throw new Error('File upload failed')
  const json = await res.json()
  return json[0].id
}

const SUBTHEMES = [
  'Primary Health Care',
  'Maternal & Child Health',
  'Non-Communicable Diseases',
  'Infectious Diseases & Epidemiology',
  'Mental Health',
  'Health Systems & Policy',
  'Digital Health & Innovation',
  'Nutrition & Food Security',
  'Community Health & Promotion',
  'Environmental & Occupational Health',
  'Health Education & Research',
  'Other',
]

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function AbstractForm() {
  const { id } = useParams<{ id?: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const isEdit = !!id

  const [conferences, setConferences] = useState<Conference[]>([])
  const [serverError, setServerError] = useState('')
  const [loadingData, setLoadingData] = useState(isEdit)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingFile, setExistingFile] = useState<{ name: string; url: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AbstractInput>({ resolver: zodResolver(abstractSchema) })

  const charCount = watch('abstractText')?.length ?? 0

  useEffect(() => {
    getConferences().then(setConferences)
  }, [])

  useEffect(() => {
    if (!isEdit || !token) return
    getAbstractById(token, Number(id)).then((ab) => {
      if (ab) {
        reset({
          title: ab.title,
          abstractText: ab.abstractText,
          keywords: ab.keywords ?? '',
          conference: typeof ab.conference === 'object' ? (ab.conference as any)?.id : undefined,
          presentationType: ab.presentationType,
          subtheme: ab.subtheme ?? '',
          coAuthors: ab.coAuthors ?? '',
          institution: ab.institution ?? '',
        })
        if (ab.documentUpload) {
          setExistingFile({
            name: (ab.documentUpload as any).name ?? 'Uploaded document',
            url: `${BASE_URL}${(ab.documentUpload as any).url}`,
          })
        }
      }
      setLoadingData(false)
    })
  }, [id, isEdit, token, reset])

  // Pre-fill institution from user profile on new abstract
  useEffect(() => {
    if (!isEdit && user?.institution) {
      reset((prev) => ({ ...prev, institution: user.institution ?? '' }))
    }
  }, [isEdit, user, reset])

  const onSubmit = async (data: AbstractInput, status: 'draft' | 'submitted') => {
    if (!token || !user) return
    setServerError('')
    try {
      let documentUploadId: number | undefined
      if (selectedFile) {
        documentUploadId = await uploadFile(token, selectedFile)
      }

      if (isEdit) {
        await updateAbstract(token, Number(id), {
          ...data,
          status,
          ...(documentUploadId !== undefined ? { documentUpload: documentUploadId } : {}),
        })
      } else {
        await createAbstract(token, {
          ...data,
          status,
          ...(documentUploadId !== undefined ? { documentUpload: documentUploadId } : {}),
        })
      }
      navigate('/dashboard/abstracts')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save abstract.')
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors resize-none ${hasError ? 'border-red-400' : 'border-gray-200'}`

  if (loadingData) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-6">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-lg font-serif font-bold text-charcoal">{isEdit ? 'Edit Abstract' : 'Submit New Abstract'}</h2>
          <p className="text-sm text-gray-500 mt-1">All fields marked * are required.</p>
        </div>

        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        <Field label="Abstract Title" required error={errors.title?.message}>
          <input
            {...register('title')}
            className={inputClass(!!errors.title)}
            placeholder="Full title of your research"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Conference" required error={errors.conference?.message}>
            <Controller
              name="conference"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                  value={field.value ?? ''}
                  className={inputClass(!!errors.conference)}
                >
                  <option value="">Select conference…</option>
                  {conferences.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} {c.year ? `(${c.year})` : ''}</option>
                  ))}
                </select>
              )}
            />
          </Field>

          <Field label="Presentation Type" required error={errors.presentationType?.message}>
            <select {...register('presentationType')} className={inputClass(!!errors.presentationType)}>
              <option value="">Select type…</option>
              <option value="oral">Oral Presentation</option>
              <option value="poster">Poster Presentation</option>
              <option value="workshop">Workshop</option>
              <option value="virtual">Virtual Presentation</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Subtheme" error={errors.subtheme?.message} hint="Select the subtheme that best fits your abstract">
            <select {...register('subtheme')} className={inputClass(!!errors.subtheme)}>
              <option value="">Select subtheme…</option>
              {SUBTHEMES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Institution / Affiliation" error={errors.institution?.message}>
            <input
              {...register('institution')}
              className={inputClass(!!errors.institution)}
              placeholder="Your institution or organisation"
            />
          </Field>
        </div>

        <Field
          label="Co-Authors"
          error={errors.coAuthors?.message}
          hint="Comma-separated list of co-authors, e.g. Jane Doe, John Smith"
        >
          <input
            {...register('coAuthors')}
            className={inputClass(!!errors.coAuthors)}
            placeholder="Jane Doe, John Smith"
          />
        </Field>

        <Field
          label="Abstract Text"
          required
          error={errors.abstractText?.message}
          hint={`${charCount}/3000 characters (minimum 150)`}
        >
          <textarea
            {...register('abstractText')}
            rows={10}
            className={inputClass(!!errors.abstractText)}
            placeholder="Provide background, objectives, methods, results, and conclusions…"
          />
        </Field>

        <Field
          label="Keywords"
          required
          error={errors.keywords?.message}
          hint="Comma-separated, e.g. health systems, UHC, Africa"
        >
          <input
            {...register('keywords')}
            className={inputClass(!!errors.keywords)}
            placeholder="health systems, UHC, Africa"
          />
        </Field>

        {/* Document upload */}
        <Field
          label="Supporting Document"
          hint="Optional — PDF, Word, or PowerPoint (max 10 MB)"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />

          {/* Show existing upload when editing */}
          {existingFile && !selectedFile && (
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-sm bg-gray-50 text-sm mb-2">
              <FileText size={16} className="text-primary shrink-0" />
              <a
                href={existingFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline truncate flex-1"
              >
                {existingFile.name}
              </a>
              <span className="text-xs text-gray-400 shrink-0">current</span>
            </div>
          )}

          {selectedFile ? (
            <div className="flex items-center gap-3 px-4 py-3 border border-primary/30 rounded-sm bg-primary/5 text-sm">
              <FileText size={16} className="text-primary shrink-0" />
              <span className="text-charcoal truncate flex-1">{selectedFile.name}</span>
              <span className="text-xs text-gray-400 shrink-0">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <button
                type="button"
                onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 w-full border border-dashed border-gray-300 rounded-sm text-sm text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Paperclip size={15} />
              {existingFile ? 'Replace document…' : 'Attach document…'}
            </button>
          )}
        </Field>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSubmit((d) => onSubmit(d, 'draft'))}
          >
            <Save size={15} /> Save as Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={handleSubmit((d) => onSubmit(d, 'submitted'))}
          >
            <Send size={15} /> {isSubmitting ? 'Submitting…' : 'Submit for Review'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/abstracts')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
