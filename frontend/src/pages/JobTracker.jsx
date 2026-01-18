import { useEffect, useMemo, useState } from 'react'
import JobCard, { sortJobsForAppliedBox } from '../components/JobCard'
import AddJobModal from '../components/AddJobModal'
import axios from "axios"

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  )
}

function yyyyMmDdToday() {
  const d = new Date()
  const yyyy = String(d.getFullYear())
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function EditJobModal({ open, job, onClose, onSave }) {
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [dateApplied, setDateApplied] = useState(yyyyMmDdToday())
  const [status, setStatus] = useState('Not Applied')
  const [notes, setNotes] = useState('')

  

  useEffect(() => {
    if (!open || !job) return
    setPosition(job.positionTitle ?? '')
    // console.log(job)
    setCompany(job.companyName ?? '')
    setLocation(job.location ?? '')
    setDateApplied(job.dateapplied || yyyyMmDdToday())
    setStatus(job.status ?? 'Not Applied')
    setNotes(job.notes ?? '')




  }, [open, job])

  if (!open || !job) return null

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 14,
    border: '2px solid #ddd',
    outline: 'none',
    fontSize: 18,
  }

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        zIndex: 999,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 'min(680px, 96vw)',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'white',
          borderRadius: 18,
          padding: 18,
          border: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 34, fontWeight: 950 }}>Edit Job</div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 32,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Position *</div>
          <input
            style={inputStyle}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., SWE Intern"
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Company *</div>
          <input
            style={inputStyle}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google"
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Location</div>
          <input
            style={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Toronto / Remote"
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Date Applied</div>
          <input
            type="date"
            style={inputStyle}
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Status</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option>Not Applied</option>
            <option>APPLIED</option>
            <option>INTERVIEW</option>
            <option>OFFER</option>
            <option>ACCEPTED</option>
            <option>REJECTED</option>
          </select>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Notes</div>
          <textarea
            style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything important..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 18px',
              borderRadius: 16,
              border: '2px solid #ddd',
              background: 'white',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: 22,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!position.trim() || !company.trim()) return
              onSave({
                ...job,
                jobid: job.id,
                positionTitle: position.trim(),
                companyName: company.trim(),
                location: location.trim(),
                dateapplied: dateApplied || yyyyMmDdToday(),
                status,
                notes: notes,
              })
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 16,
              border: '2px solid #111',
              background: '#111',
              color: 'white',
              fontWeight: 950,
              cursor: 'pointer',
              fontSize: 22,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobTracker() {
  const [jobs, setJobs] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  const offeredJobs = useMemo(() => jobs.filter((j) => j.status === 'OFFER'), [jobs])
  const notAppliedJobs = useMemo(() => jobs.filter((j) => j.status === 'NOT_APPLIED'), [jobs])

  const appliedJobs = useMemo(() => {
    const group = jobs.filter((j) => j.status !== 'NOT_APPLIED' && j.status !== 'OFFER')
    return sortJobsForAppliedBox(group)
  }, [jobs])

  useEffect(()=>{

      (async ()=>{
        const existingId = localStorage.getItem("key");
        const ensureRes = await axios.post("http://localhost:3000/api/key", {
          id: existingId,
        });

        const userId = ensureRes.data.id;
        localStorage.setItem("key", userId);
        const jobs = await axios.get("http://localhost:3000/api/jobs",{headers: { "user-id": localStorage.getItem("key") }
        })
        setJobs(jobs.data.data[0].jobs)
     
      })()
    

  },[])

  function onChangeStatus(id, newStatus) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)))
  }

  function onAddJob(newJob) {
    setJobs((prev) => [newJob, ...prev])
  }

  function openEdit(job) {
    setEditingJob(job)
    setIsEditOpen(true)
  }

  async function onSaveEdit(updatedJob) {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)))
    setIsEditOpen(false)
    setEditingJob(null)

    try{
      console.log(updatedJob)
      await axios.patch("http://localhost:3000/api/jobs",updatedJob,{headers: { "user-id": localStorage.getItem("key") }
        })
      const jobs = await axios.get("http://localhost:3000/api/jobs",{headers: { "user-id": localStorage.getItem("key") }
        })
      setJobs(jobs.data.data[0].jobs)


    } catch(err){
      console.log(err)
      alert("update failed")
    }

  }

  function onDeleteJob(id) {
  setJobs((prev) => prev.filter((j) => j.id !== id))
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
          <JobCard
            key={job.id}
            job={job}
            onChangeStatus={onChangeStatus}
            onEdit={openEdit}
            onDelete={onDeleteJob}
          />
        ))}
      </Section>

      <Section title="Not Applied Yet">
        {notAppliedJobs.length === 0 ? <div style={{ color: '#777' }}>No jobs in “Not Applied”.</div> : null}
        {notAppliedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onChangeStatus={onChangeStatus}
            onEdit={openEdit}
            onDelete={onDeleteJob}
          />
        ))}
      </Section>

      <Section title="Applied Jobs">
        {appliedJobs.length === 0 ? <div style={{ color: '#777' }}>No applied jobs yet.</div> : null}
        {appliedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onChangeStatus={onChangeStatus}
            onEdit={openEdit}
            onDelete={onDeleteJob}
          />
        ))}
      </Section>

      <AddJobModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={onAddJob} setJobs={setJobs}/>

      <EditJobModal
        open={isEditOpen}
        job={editingJob}
        onClose={() => {
          setIsEditOpen(false)
          setEditingJob(null)
        }}
        onSave={onSaveEdit}
      />
    </div>
  )
}
