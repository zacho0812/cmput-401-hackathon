import { useEffect, useState } from 'react'
import axios from "axios";

export default function AddCommunicationModal({
  open,
  onClose,
  onSave,
  communication,
}) {
  const [type, setType] = useState('EMAIL')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (open) {
      if (communication) {
        setType(communication.type)
        setContact(communication.contact)
        setNotes(communication.notes)
      } else {
        setType('EMAIL')
        setContact('')
        setNotes('')
      }
    }
  }, [open, communication])

  if (!open) return null



  // Handle submitting to backend
   async function handleSubmit(e) {
    e.preventDefault()

    if (!contact.trim()) {
      alert('Please enter a contact or company.')
      console.log("hello")
      return
    }


    const payload = {
      contact: contact.trim(),
      notes: notes.trim(),
      type: type,
      //time: communication?.time ?? new Date().toLocaleString(),
    }

    

    try{

        const res= await axios.post(`http://localhost:3000/api/logs`,payload,
          {headers: { "user-id": localStorage.getItem("key") }
        })

      const logs = await axios.get("http://localhost:3000/api/logs",{headers: { "user-id": localStorage.getItem("key") }
        })

      const newLog = res.data.logs ?? res.data
      onSave(newLog)


    } catch(err){

      alert("log failed")


    }
    

    // submitFn(jobToSubmit)
    onClose?.()
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">
            {communication ? 'Edit Communication' : 'Add Communication'}
          </div>
          <button onClick={onClose} className="modalCloseBtn" aria-label="Close" type="button">
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
              <option>EMAIL</option>
              <option>PHONE</option>
              <option>IN_PERSON</option>
              <option>LINKEDIN</option>
              <option>OTHER</option>
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
   Styles (kept the same)
   ======================= */

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
  boxSizing: 'border-box',
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
