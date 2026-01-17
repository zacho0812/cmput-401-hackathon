import { useEffect, useMemo, useState, useRef } from 'react'
import ResumeEditorModal from '../components/ResumeEditorModal'
import { downloadJson } from '../utils/download'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const STORAGE_KEY = 'job-organizer-master-resume'
const COPIES_KEY = 'job-organizer-resume-copies'

const defaultMaster = {
  contact: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  summary: '',
  education: [{ school: '', degree: '', start: '', end: '', gpa: '' }],
  experience: [{ company: '', role: '', start: '', end: '', location: '', bullets: [] }],
  skillsText: '',
}

export default function MasterResume() {
  const resumeRef = useRef(null)
  const [master, setMaster] = useState(defaultMaster)
  const [copies, setCopies] = useState([])
  const [isEditMasterOpen, setIsEditMasterOpen] = useState(false)
  const [editingCopyId, setEditingCopyId] = useState(null)

  useEffect(() => {
    const savedMaster = localStorage.getItem(STORAGE_KEY)
    if (savedMaster) setMaster(JSON.parse(savedMaster))
    const savedCopies = localStorage.getItem(COPIES_KEY)
    if (savedCopies) setCopies(JSON.parse(savedCopies))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(master))
  }, [master])

  useEffect(() => {
    localStorage.setItem(COPIES_KEY, JSON.stringify(copies))
  }, [copies])

  const editingCopy = useMemo(() => copies.find((c) => c.id === editingCopyId) || null, [copies, editingCopyId])

  function createCopy() {
    const name = prompt('Name this resume copy (e.g., "Google SWE Intern")')
    if (!name) return
    const newCopy = {
      id: Date.now(),
      name: name.trim(),
      data: JSON.parse(JSON.stringify(master)),
      createdAt: new Date().toLocaleString(),
    }
    setCopies((prev) => [newCopy, ...prev])
    setEditingCopyId(newCopy.id)
  }

  function saveMaster(updated) { setMaster(updated) }
  function saveCopy(updatedData) {
    setCopies((prev) => prev.map((c) => (c.id === editingCopyId ? { ...c, data: updatedData } : c)))
  }
  function deleteCopy(id) {
    if (!confirm('Delete this resume copy?')) return
    setCopies((prev) => prev.filter((c) => c.id !== id))
  }

  async function downloadMaster() {
    const element = resumeRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${master.contact.fullName || 'resume'}.pdf`);
  }

  function downloadCopy(copy) {
    alert(`Download for "${copy.name}" will be added later.`)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>Master Resume</div>
          <div style={{ color: '#666', marginTop: 6 }}>Store a master template, then create tailored copies.</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button style={outlineBtnBlue} onClick={createCopy}>+ Copy Master</button>
          <button style={outlineBtn} onClick={downloadMaster}>Download Master</button>
          <button style={primaryBtn} onClick={() => setIsEditMasterOpen(true)}>Edit Master</button>
        </div>
      </div>

      {/* FIXED: The resume content is now INSIDE the div with the ref */}
      <div 
        ref={resumeRef} 
        style={{ 
          marginTop: 18, 
          border: '1px solid #eee', 
          borderRadius: 12, 
          padding: 24, 
          backgroundColor: 'white' 
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 950, marginBottom: 8 }}>Master Preview</div>
        <div style={{ color: '#333', fontWeight: 900 }}>{master.contact.fullName || '(Your Name)'}</div>
        <div style={{ color: '#555', marginTop: 4 }}>
          {[master.contact.email, master.contact.phone, master.contact.location].filter(Boolean).join(' • ') || '(Contact info)'}
        </div>
        {master.summary ? <div style={{ marginTop: 10, color: '#444' }}>{master.summary}</div> : null}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>Resume Copies (Tailored)</div>
        {copies.length === 0 ? (
          <div style={{ color: '#777' }}>No copies yet. Click “+ Copy Master”.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {copies.map((c) => (
              <div key={c.id} style={copyRowStyle}>
                <div>
                  <div style={{ fontWeight: 950 }}>{c.name}</div>
                  <div style={{ color: '#666', marginTop: 4 }}>Created: {c.createdAt}</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={outlineBtn} onClick={() => downloadCopy(c)}>Download</button>
                  <button style={outlineBtnBlue} onClick={() => setEditingCopyId(c.id)}>Edit</button>
                  <button style={dangerBtn} onClick={() => deleteCopy(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ResumeEditorModal open={isEditMasterOpen} title="Edit Master" initialValue={master} onClose={() => setIsEditMasterOpen(false)} onSave={saveMaster} />
      <ResumeEditorModal open={!!editingCopyId} title="Edit Copy" initialValue={editingCopy ? editingCopy.data : master} onClose={() => setEditingCopyId(null)} onSave={saveCopy} />
    </div>
  )
}

/* Styles */
const primaryBtn = { padding: '10px 14px', borderRadius: 10, border: '1px solid #111', background: '#111', color: 'white', fontWeight: 900, cursor: 'pointer' };
const outlineBtn = { padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', background: 'white', fontWeight: 900, cursor: 'pointer' };
const outlineBtnBlue = { padding: '10px 14px', borderRadius: 10, border: '2px solid #1f5eff', background: 'white', fontWeight: 900, cursor: 'pointer' };
const dangerBtn = { padding: '10px 14px', borderRadius: 10, border: '1px solid #ffd1d1', background: '#fff5f5', fontWeight: 900, cursor: 'pointer' };
const copyRowStyle = { border: '1px solid #eee', borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 };