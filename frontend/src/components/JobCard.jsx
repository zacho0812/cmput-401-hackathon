const STATUS_ORDER = {
  Interview: 0,
  Offer: 1,
  Accepted: 2,
  Applied: 3,
  'Not Applied': 4,
  Rejected: 5,
}

function badgeStyle(status) {
  const base = {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    display: 'inline-block',
  }
  if (status === 'APPLIED') return { ...base, background: '#d8f5d8' }
  if (status === 'INTERVIEW') return { ...base, background: '#fff3bf' }
  if (status === 'OFFER') return { ...base, background: '#dbeafe' }
  if (status === 'ACCEPTED') return { ...base, background: '#bbf7d0' }
  if (status === 'REJECTED') return { ...base, background: '#ffd8a8' }
  return { ...base, background: '#eee' }
}

export function sortJobsForAppliedBox(jobs) {
  return [...jobs].sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))
}

export default function JobCard({ job, onChangeStatus, onEdit, onDelete }) {
  return (
    <div
      onClick={() => onEdit?.(job)}
      className="blockCard" /* ✅ adds visible frame from index.css */
      style={{
        /* keep your existing layout styles */
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
        cursor: 'pointer',
      }}
      role="button"
      tabIndex={0}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800 }}>{job.positionTitle}</div>
        <div style={{ color: '#444', marginTop: 2 }}>
          {job.companyName}
          {job.location ? <> • {job.location}</> : null}
        </div>
        <div style={{ color: '#666', marginTop: 6 }}>
          Date Applied: {job.dateapplied.split('T')[0] || 'N/A'}
          {job.notes ? <> • Notes: {job.notes}</> : null}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span style={badgeStyle(job.status)}>{job.status}</span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(job.id)
          }}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #f3b4b4',
            background: '#fff5f5',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
