const STATUS_ORDER = {
  Interview: 0,
  Offer: 1,
  Accepted: 2,
  Applied: 3,
  'Not Applied': 4,
  Rejected: 5,
}

function badgeStyle(status) {
  const base = { padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'inline-block' }
  if (status === 'Applied') return { ...base, background: '#d8f5d8' }
  if (status === 'Interview') return { ...base, background: '#fff3bf' }
  if (status === 'Offer') return { ...base, background: '#dbeafe' }
  if (status === 'Accepted') return { ...base, background: '#bbf7d0' }
  if (status === 'Rejected') return { ...base, background: '#ffd8a8' }
  return { ...base, background: '#eee' }
}

export function sortJobsForAppliedBox(jobs) {
  return [...jobs].sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))
}

export default function JobCard({ job, onChangeStatus }) {
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 12,
      padding: 12,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800 }}>{job.position}</div>
        <div style={{ color: '#444', marginTop: 2 }}>
          {job.company} • {job.location}
        </div>
        <div style={{ color: '#666', marginTop: 6 }}>
          Date Applied: {job.dateApplied || 'N/A'} • Notes: {job.notes || ''}
          {job.notes ? <> • Notes: {job.notes}</> : null}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span style={badgeStyle(job.status)}>{job.status}</span>

        <select
          value={job.status}
          onChange={(e) => onChangeStatus(job.id, e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        >
          <option>Not Applied</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>
    </div>
  )
}
