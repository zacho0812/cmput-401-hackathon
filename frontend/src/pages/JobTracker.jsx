import { useMemo, useState } from 'react'
import { mockJobs } from '../data/mockJobs'
import JobCard, { sortJobsForAppliedBox } from '../components/JobCard'
import AddJobModal from '../components/AddJobModal'

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

export default function JobTracker() {
  const [jobs, setJobs] = useState(mockJobs)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const offeredJobs = useMemo(() => jobs.filter((j) => j.status === 'Offer'), [jobs])

  const notAppliedJobs = useMemo(() => jobs.filter((j) => j.status === 'Not Applied'), [jobs])

  const appliedJobs = useMemo(() => {
    const group = jobs.filter((j) => j.status !== 'Not Applied' && j.status !== 'Offer')
    return sortJobsForAppliedBox(group)
  }, [jobs])

  function onChangeStatus(id, newStatus) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)))
  }

  function onAddJob(newJob) {
    // add new job to the top of the list
    setJobs((prev) => [newJob, ...prev])
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>Job Tracker</div>
          <div style={{ color: '#666', marginTop: 6 }}>
            Offered jobs, not applied yet, and applied jobs (interviews on top, rejections at bottom).
          </div>
        </div>

        <button
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #1f5eff',
            background: 'white',
            fontWeight: 900,
            cursor: 'pointer',
          }}
          onClick={() => setIsAddOpen(true)}
        >
          + Add Job
        </button>
      </div>

      <Section title="Offered Jobs">
        {offeredJobs.length === 0 ? <div style={{ color: '#777' }}>No offers yet.</div> : null}
        {offeredJobs.map((job) => (
          <JobCard key={job.id} job={job} onChangeStatus={onChangeStatus} />
        ))}
      </Section>

      <Section title="Not Applied Yet">
        {notAppliedJobs.length === 0 ? <div style={{ color: '#777' }}>No jobs in “Not Applied”.</div> : null}
        {notAppliedJobs.map((job) => (
          <JobCard key={job.id} job={job} onChangeStatus={onChangeStatus} />
        ))}
      </Section>

      <Section title="Applied Jobs">
        {appliedJobs.length === 0 ? <div style={{ color: '#777' }}>No applied jobs yet.</div> : null}
        {appliedJobs.map((job) => (
          <JobCard key={job.id} job={job} onChangeStatus={onChangeStatus} />
        ))}
      </Section>

      <AddJobModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={onAddJob} />
    </div>
  )
}
