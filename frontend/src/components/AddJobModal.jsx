import { useEffect, useState } from 'react'

export default function AddJobModal({ open, onClose, onAdd }) {
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('Not Applied')

  // Reset form whenever modal opens
  useEffect(() => {
    if (open) {
      setPosition('')
      setCompany('')
      setLocation('')
      setDeadline('')
      setNotes('')
      setStatus('Not Applied')
    }
  }, [open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!position.trim() || !company.trim()) {
      alert('Please fill in Position and Company.')
      return
    }

    onAdd({
      id: Date.now(), // simple unique id for now
      position: position.trim(),
      company: company.trim(),
      location: location.trim(),
      deadline: deadline || '',
      notes: notes.trim(),
      status,
    })

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
          maxWidth: 520,
          borderRadius: 14,
          padding: 16,
          border: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Add Job</div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}
            aria-label="Close"
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
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Deadline</div>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
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
              style={{ ...inputStyle, height: 90, resize: 'vertical' }}
              placeholder="Anything important..."
            />
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" onClick={onClose} style={secondaryBtn}>
              Cancel
            </button>
            <button type="submit" style={primaryBtn}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
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
