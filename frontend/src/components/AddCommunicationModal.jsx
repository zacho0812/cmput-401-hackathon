import { useEffect, useState } from 'react'

export default function AddCommunicationModal({ open, onClose, onAdd }) {
  const [type, setType] = useState('Email')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (open) {
      setType('Email')
      setContact('')
      setNotes('')
    }
  }, [open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!contact.trim()) {
      alert('Please enter a contact or company.')
      return
    }

    onAdd({
      id: Date.now(),
      type,
      contact: contact.trim(),
      notes: notes.trim(),
      time: new Date().toLocaleString(),
    })

    onClose()
  }

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={modal}>
        <div style={header}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Add Communication</div>
          <button onClick={onClose} style={closeBtn} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={form}>
          <label>
            <div style={label}>Type</div>
            <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
              <option>Email</option>
              <option>Phone</option>
              <option>Interview</option>
              <option>LinkedIn</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            <div style={label}>Contact / Company *</div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={input}
              placeholder="e.g., Google recruiter"
            />
          </label>

          <label>
            <div style={label}>Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...input, height: 160, resize: 'vertical' }}
              placeholder="What was discussed?"
            />
          </label>

          <div style={footer}>
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

/* =======================
   Styles
   ======================= */

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 9999,
}

const modal = {
  background: 'white',
  width: '100%',
  maxWidth: 720,
  borderRadius: 14,
  padding: 16,
  border: '1px solid #eee',
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const closeBtn = {
  border: 'none',
  background: 'transparent',
  fontSize: 18,
  cursor: 'pointer',
}

const form = {
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const label = {
  fontWeight: 700,
  marginBottom: 4,
}

const input = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ddd',
  outline: 'none',
}

const footer = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 8,
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
