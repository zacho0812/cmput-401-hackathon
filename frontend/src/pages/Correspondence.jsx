import { useState } from 'react'
import AddCommunicationModal from '../components/AddCommunicationModal'

export default function Correspondence() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [log, setLog] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)

  function handleSave(entry) {
    setLog((prev) =>
      prev.some((e) => e.id === entry.id)
        ? prev.map((e) => (e.id === entry.id ? entry : e))
        : [entry, ...prev]
    )
  }

  function handleDelete(id) {
    if (confirm('Delete this communication?')) {
      setLog((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div style={page}>
      <div style={headerRow}>
        <div>
          <div style={title}>Correspondence Log</div>
          <div style={subtitle}>
            Track communication with recruiters and companies.
          </div>
        </div>

        <button
          onClick={() => {
            setEditingEntry(null)
            setIsModalOpen(true)
          }}
          style={addBtn}
        >
          + Add Communication
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {log.length === 0 ? (
          <div style={empty}>No communication logged yet.</div>
        ) : (
          <div style={list}>
            {log.map((e) => (
              <div key={e.id} style={card}>
                <div style={cardHeader}>
                  <div style={cardTitle}>
                    {e.type} — {e.contact}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => {
                        setEditingEntry(e)
                        setIsModalOpen(true)
                      }}
                      style={iconBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      style={{ ...iconBtn, color: '#EA8987' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {e.notes && (
                  <div style={notes}>
                    {e.notes}
                  </div>
                )}

                <div style={time}>{e.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddCommunicationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEntry(null)
        }}
        onSave={handleSave}
        communication={editingEntry}
      />
    </div>
  )
}

/* =======================
   Styles (Palette matched)
   ======================= */

const page = {
  background: '#F0EEDD',
}

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
}

const title = {
  fontSize: 28,
  fontWeight: 950,
  color: '#376E8C',
}

const subtitle = {
  color: '#7D8F9B',
  marginTop: 6,
}

const addBtn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  background: '#81B857',
  color: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const empty = {
  color: '#7D8F9B',
}

const list = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const card = {
  background: 'white',
  border: '1px solid #C1D2D0',
  borderRadius: 12,
  padding: 12,
}

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const cardTitle = {
  fontWeight: 900,
  color: '#376E8C',
}

const notes = {
  marginTop: 6,
  whiteSpace: 'pre-wrap',
  color: '#376E8C',
}

const time = {
  color: '#7D8F9B',
  marginTop: 8,
  fontSize: 12,
}

const iconBtn = {
  border: 'none',
  background: 'transparent',
  fontWeight: 800,
  cursor: 'pointer',
  color: '#376E8C',
}
