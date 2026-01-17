import { useEffect, useMemo, useState } from 'react'

export default function AddJobModal({
  open,
  onClose,

  // For compatibility with your existing code:
  onAdd,     // used when adding
  onSave,    // optional, used when editing

  // When you pass a job here, the modal becomes "Edit" mode
  initialJob = null,
}) {
  const isEdit = !!initialJob

  const submitFn = useMemo(() => {
    // Prefer onSave in edit mode, else fall back to onAdd
    if (isEdit) return onSave || onAdd
    return onAdd
  }, [isEdit, onAdd, onSave])

  const todayStr = useMemo(() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [dateApplied, setDateApplied] = useState(todayStr)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('Not Applied')

  // Reset / prefill form whenever modal opens OR initialJob changes
  useEffect(() => {
    if (!open) return

    if (initialJob) {
      setPosition(initialJob.position || '')
      setCompany(initialJob.company || '')
      setLocation(initialJob.location || '')
      setDateApplied(initialJob.dateApplied || todayStr)
      setNotes(initialJob.notes || '')
      setStatus(initialJob.status || 'Not Applied')
    } else {
      setPosition('')
      setCompany('')
      setLocation('')
      setDateApplied(todayStr)
      setNotes('')
      setStatus('Not Applied')
    }
  }, [open, initialJob, todayStr])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!position.trim() || !company.trim()) {
      alert('Please fill in Position and Company.')
      return
    }

    if (!submitFn) {
      // If you haven’t wired the handler yet, just close
      onClose?.()
      return
    }

    const jobToSubmit = {
      id: initialJob?.id ?? Date.now(),
      position: position.trim(),
      company: company.trim(),
      location: location.trim(),
      dateApplied: dateApplied || todayStr,
      notes: notes, // keep spaces + multi-line (don’t trim hard)
      status,
    }

    submitFn(jobToSubmit)
    onClose?.()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          width: '100%',
          maxWidth: 520,
          borderRadius: 14,
          padding: 16,
          border: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{isEdit ? 'Edit Job' : 'Add Job'}</div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Position *</div>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={inputStyle}
              placeholder="e.g., SWE Intern"
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Company *</div>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={inputStyle}
              placeholder="e.g., Google"
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Location</div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
              placeholder="e.g., Toronto / Remote"
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Date Applied</div>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option>Not Applied</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputStyle, height: 110, resize: 'vertical' }}
              placeholder="Anything important..."
            />
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" onClick={onClose} style={secondaryBtn}>
              Cancel
            </button>
            <button type="submit" style={primaryBtn}>
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ddd',
  outline: 'none',
}

const primaryBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #ddd',
  background: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}
