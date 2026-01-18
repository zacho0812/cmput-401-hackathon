import { useMemo, useState } from 'react'
import AddCommunicationModal from '../components/AddCommunicationModal'

function normalizeCompany(name) {
  return (name ?? '').trim().toLowerCase()
}

export default function Correspondence() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [log, setLog] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)

  // which company groups are expanded
  const [expanded, setExpanded] = useState({})

  function handleSave(entry) {
    // update/add entry
    setLog((prev) =>
      prev.some((e) => e.id === entry.id)
        ? prev.map((e) => (e.id === entry.id ? entry : e))
        : [entry, ...prev]
    )

    // auto-expand the company group you just added/edited
    const key = normalizeCompany(entry.contact)
    setExpanded((prev) => ({ ...prev, [key]: true }))
  }

  function handleDelete(id) {
    setLog((prev) => prev.filter((e) => e.id !== id))
  }

  function toggleCompany(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Group communications by company/contact (fold them)
  const grouped = useMemo(() => {
    const groups = {}
    const order = []

    for (const entry of log) {
      const key = normalizeCompany(entry.contact)
      if (!groups[key]) {
        groups[key] = {
          key,
          company: (entry.contact ?? '').trim() || '(No company)',
          entries: [],
        }
        order.push(key) // preserve "newest-first" group order
      }
      groups[key].entries.push(entry) // preserves newest-first inside group too
    }

    return order.map((k) => groups[k])
  }, [log])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>
            Correspondence Log
          </div>
          <div style={{ color: '#666', marginTop: 6 }}>
            Track communication with recruiters and companies.
          </div>
        </div>

        <button
          onClick={() => {
            setEditingEntry(null)
            setIsModalOpen(true)
          }}
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
            {grouped.map((group) => {
              const isOpen = !!expanded[group.key]
              const latestTime = group.entries[0]?.time

              return (
                <div
                  key={group.key}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  {/* Company header (click to expand/collapse) */}
                  <div
                    onClick={() => toggleCompany(group.key)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 950, fontSize: 16 }}>
                        {group.company}
                      </div>
                      <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
                        {group.entries.length} entr{group.entries.length === 1 ? 'y' : 'ies'}
                        {latestTime ? ` • Latest: ${latestTime}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ color: '#666', fontWeight: 900 }}>
                        {isOpen ? 'Hide' : 'Show'}
                      </div>
                      <div style={{ fontSize: 18, lineHeight: 1 }}>
                        {isOpen ? '▾' : '▸'}
                      </div>
                    </div>
                  </div>

                  {/* Entries inside the company */}
                  {isOpen && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {group.entries.map((e) => (
                        <div
                          key={e.id}
                          style={{
                            borderTop: '1px solid #f0f0f0',
                            paddingTop: 10,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 10,
                            }}
                          >
                            <div style={{ fontWeight: 900 }}>
                              {e.type}
                            </div>

                            <div style={{ display: 'flex', gap: 10 }}>
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation()
                                  setEditingEntry(e)
                                  setIsModalOpen(true)
                                }}
                                style={iconBtn}
                              >
                                Edit
                              </button>
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation()
                                  handleDelete(e.id)
                                }}
                                style={{ ...iconBtn, color: '#c00' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div style={{ marginTop: 6, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            {e.notes}
                          </div>

                          <div style={{ color: '#888', marginTop: 8, fontSize: 12 }}>
                            {e.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
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

const iconBtn = {
  border: 'none',
  background: 'transparent',
  fontWeight: 800,
  cursor: 'pointer',
}
