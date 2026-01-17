import { useState } from 'react'
import AddCommunicationModal from '../components/AddCommunicationModal'

export default function Correspondence() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [log, setLog] = useState([])

  function onAddEntry(entry) {
    setLog((prev) => [entry, ...prev])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>Correspondence Log</div>
          <div style={{ color: '#666', marginTop: 6 }}>
            Track communication with recruiters and companies.
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #1f5eff',
            background: 'white',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          + Add Communication
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {log.length === 0 ? (
          <div style={{ color: '#777' }}>No communication logged yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {log.map((e) => (
              <div key={e.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 900 }}>
                  {e.type} — {e.contact}
                </div>
                <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{e.notes}</div>
                <div style={{ color: '#888', marginTop: 8, fontSize: 12 }}>{e.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddCommunicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddEntry}
      />
    </div>
  )
}
