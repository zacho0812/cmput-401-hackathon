import { useEffect, useState } from 'react'

export default function AddCommunicationModal({
  open,
  onClose,
  onSave,
  communication,
}) {
  const [type, setType] = useState('Email')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (open) {
      if (communication) {
        setType(communication.type)
        setContact(communication.contact)
        setNotes(communication.notes)
      } else {
        setType('Email')
        setContact('')
        setNotes('')
      }
    }
  }, [open, communication])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!contact.trim()) {
      alert('Please enter a contact or company.')
      return
    }

    onSave({
      id: communication?.id ?? Date.now(),
      type,
      contact: contact.trim(),
      notes: notes.trim(),
      time: communication?.time ?? new Date().toLocaleString(),
    })

    onClose()
  }

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={modal}>
        <div style={header}>
          <div style={title}>
            {communication ? 'Edit Communication' : 'Add Communication'}
          </div>
          <button onClick={onClose} style={closeBtn} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={form}>
          <label>
            <div style={label}>Type</div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={input}
            >
              <option>Email</option>
              <option>Phone</option>
              <option>In Person</option>
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
              {communication ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =======================
   Styles (Palette applied)
   ======================= */

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(55, 110, 140, 0.35)', // derived from #376E8C
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 9999,
}

const modal = {
  background: '#F0EEDD',
  width: '100%',
  maxWidth: 720,
  borderRadius: 14,
  padding: 16,
  border: '1px solid #C1D2D0',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
}

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const title = {
  fontSize: 18,
  fontWeight: 900,
  color: '#376E8C',
}

const closeBtn = {
  border: 'none',
  background: 'transparent',
  fontSize: 18,
  cursor: 'pointer',
  color: '#7D8F9B',
}

const form = {
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const label = {
  fontWeight: 700,
  marginBottom: 4,
  color: '#376E8C',
}

const input = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #C1D2D0',
  outline: 'none',
  boxSizing: 'border-box',
  background: 'white',
  color: '#376E8C',
}

const footer = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 10,
}

const primaryBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  background: '#81B857',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #EA8987',
  background: 'transparent',
  color: '#EA8987',
  fontWeight: 800,
  cursor: 'pointer',
}
