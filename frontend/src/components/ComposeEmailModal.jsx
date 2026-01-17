import { useEffect, useState } from 'react'

export default function ComposeEmailModal({ open, onClose, onSend }) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (open) {
      setTo('')
      setSubject('')
      setBody('')
    }
  }, [open])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!to.trim()) {
      alert('Please enter a recipient (To).')
      return
    }

    onSend({
      id: Date.now(),
      to: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
      time: new Date().toLocaleString(),
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
          maxWidth: 720,
          borderRadius: 14,
          padding: 16,
          border: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Compose Email</div>
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
            <div style={{ fontWeight: 700, marginBottom: 4 }}>To *</div>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={inputStyle}
              placeholder="e.g., recruiter@company.com"
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Subject</div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={inputStyle}
              placeholder="e.g., Follow-up on SWE Intern application"
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Message</div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ ...inputStyle, height: 220, resize: 'vertical' }}
              placeholder="Write your message..."
            />
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" onClick={onClose} style={secondaryBtn}>
              Cancel
            </button>
            <button type="submit" style={primaryBtn}>
              Send
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
