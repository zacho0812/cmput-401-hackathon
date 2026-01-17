const STATUS_ORDER = {
  Interview: 0,
  Offer: 1,
  Accepted: 2,
  Applied: 3,
  'Not Applied': 4,
  Rejected: 5,
};

function badgeStyle(status) {
  const base = {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    display: 'inline-block',
  };

  if (status === 'Applied') return { ...base, background: '#d8f5d8' };
  if (status === 'Interview') return { ...base, background: '#fff3bf' };
  if (status === 'Offer') return { ...base, background: '#dbeafe' };
  if (status === 'Accepted') return { ...base, background: '#bbf7d0' };
  if (status === 'Rejected') return { ...base, background: '#ffd8a8' };
  return { ...base, background: '#eee' };
}

export function sortJobsForAppliedBox(jobs) {
  return [...jobs].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );
}

export default function JobCard({ job, onChangeStatus }) {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    // 1️⃣ Update frontend state (existing behavior)
    onChangeStatus(job.id, newStatus);

    // 2️⃣ Only notify on meaningful status changes (optional but recommended)
    const shouldNotify = ['Interview', 'Offer', 'Accepted', 'Rejected'].includes(newStatus);
    if (!shouldNotify) return;

    // 3️⃣ Call notification backend (demo values for now)
    try {
      await fetch('http://localhost:3000/api/notifications/send/application-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@example.com', // TODO: replace with real user email later
          phone: '1234567890',       // TODO: replace with real user phone later
          jobTitle: job.position,
          company: job.company,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error('Notification failed:', err);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800 }}>{job.position}</div>
        <div style={{ color: '#444', marginTop: 2 }}>
          {job.company} • {job.location}
        </div>
        <div style={{ color: '#666', marginTop: 6 }}>
          Deadline: {job.deadline || 'N/A'} • Date Applied:{' '}
          {job.dateApplied || 'N/A'}
          {job.notes ? <> • Notes: {job.notes}</> : null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        <span style={badgeStyle(job.status)}>{job.status}</span>

        <select
          value={job.status}
          onChange={handleStatusChange}
          style={{
            padding: 8,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
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
  );
}
