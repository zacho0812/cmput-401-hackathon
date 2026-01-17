import { useEffect, useState } from 'react'

function todayYYYYMMDD() {
  return new Date().toISOString().slice(0, 10)
}

export default function AddJobModal({
  open,
  onClose,

  // add mode
  onAdd,

  // edit mode
  mode = 'add',         // 'add' or 'edit'
  initialJob = null,    // job to edit
  onSave,               // save edited job
}) {
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [dateApplied, setDateApplied] = useState(todayYYYYMMDD())
  const [status, setStatus] = useState('Not Applied')
  const [notes, setNotes] = useState('')

  // When modal opens, set fields:
  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && initialJob) {
      setPosition(initialJob.position || '')
      setCompany(initialJob.company || '')
      setLocation(initialJob.location || '')
      setDateApplied(initialJob.dateApplied || todayYYYYMMDD())
      setStatus(initialJob.status || 'Not Applied')
      setNotes(initialJob.notes || '')
    } else {
      // add mode reset
      setPosition('')
      setCompany('')
      setLocation('')
      setDateApplied(todayYYYYMMDD())
      setStatus('Not Applied')
      setNotes('')
    }
  }, [open, mode, initialJob])

  if (!open) return null

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: 10,
    borderRadius: 12,
    border: '1px solid #d8d8d8',
    outline: 'none',
    background: 'white',
    fontSize: 18,
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!position.trim() || !company.trim()) {
      alert('Please fill in Position and Company.')
      return
    }

    if (mode === 'edit') {
      const updated = {
        ...initialJob,
        position: position.trim(),
        company: company.trim(),
        location: location.trim(),
        dateApplied: dateApplied || '',
        status,
        notes: notes.trim(),
      }
      onSave(updated)
      onClose()
      return
    }

    // add mode
    const newJob = {
      id: Date.now(),
      position: position.trim(),
      company: company.trim(),
      location: location.trim(),
      dateApplied: dateApplied || '',
      status,
      notes: notes.trim(),
    }
    onAdd(newJob)
    onClose()
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
          maxWidth: 650,
          borderRadius: 16,
          padding: 18,
          border: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900 }}>
            {mode === 'edit' ? 'Edit Job' : 'Add Job'}
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: 30, cursor: 'pointer' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Position *</div>
            <input
              placeholder="e.g., SWE Intern"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Company *</div>
            <input
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Location</div>
            <input
              placeholder="e.g., Toronto / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Date Applied</div>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Status</div>
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
            <div style={{ fontSize: 32, fontWeight: 900 }}>Notes</div>
            <textarea
              placeholder="Anything important..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputStyle, height: 150, resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                border: '2px solid #ddd',
                background: 'white',
                fontWeight: 900,
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            {/* ✅ Add mode: "Add"  |  Edit mode: "Save" */}
            <button
              type="submit"
              style={{
                padding: '12px 18px',
                borderRadius: 14,
                border: '2px solid #111',
                background: '#111',
                color: 'white',
                fontWeight: 900,
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              {mode === 'edit' ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
