import { useEffect, useMemo, useState } from 'react'
import ResumeEditorModal from '../components/ResumeEditorModal'
import { downloadJson } from '../utils/download'

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
  // master resume
  const [master, setMaster] = useState(defaultMaster)

  // tailored copies
  const [copies, setCopies] = useState([]) // {id, name, data, createdAt}

  // modal control
  const [isEditMasterOpen, setIsEditMasterOpen] = useState(false)
  const [editingCopyId, setEditingCopyId] = useState(null)

  // Load from localStorage
  useEffect(() => {
    const savedMaster = localStorage.getItem(STORAGE_KEY)
    if (savedMaster) setMaster(JSON.parse(savedMaster))

    const savedCopies = localStorage.getItem(COPIES_KEY)
    if (savedCopies) setCopies(JSON.parse(savedCopies))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(master))
  }, [master])

  useEffect(() => {
    localStorage.setItem(COPIES_KEY, JSON.stringify(copies))
  }, [copies])

  const editingCopy = useMemo(() => copies.find((c) => c.id === editingCopyId) || null, [copies, editingCopyId])

  async function getResume(id) {
  try {
    const response = await fetch('https://api.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.com/${id}');
    const data = await response.json();
    
    // Now you have the ID and can use it to make copies
    return data.id; 
  } catch (err) {
    console.error("Could not find master resume on server");
  }
}


  // #3 Copy button: create tailored copy from master
  async function createCopy() {
    const name = prompt('Name this resume copy (e.g., "Google SWE Intern")')
    if (!name) return

    const newCopy = {
      id: Date.now(),
      name: name.trim(),
      data: JSON.parse(JSON.stringify(master)), // deep copy
      createdAt: new Date().toLocaleString(),
    }

    try {
    // We send a POST request to a special "duplicate" endpoint
    const response = await fetch(`https://api.yourapp.com/${masterId}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }) // Optional: give it a custom name
    });

    if (!response.ok) throw new Error('Failed to copy resume');

    // The backend returns the BRAND NEW resume object (with its own unique ID)
    const newResumeCopy = await response.json();

    // Add it to your list and immediately enter "edit mode" for the new ID
    setCopies((prev) => [newCopy, ...prev])
    setEditingCopyId(newCopy.id) // open editor for the new copy

  } catch (error) {
    console.error("Copy error:", error);
  }
  }

  function saveMaster(updated) {
    setMaster(updated)
  }

  function saveCopy(updatedData) {
    setCopies((prev) =>
      prev.map((c) => (c.id === editingCopyId ? { ...c, data: updatedData } : c))
    )
  }

  // Deletes Copy, Includes Backend
    async function deleteCopy(id) {
    if (!confirm('Delete this resume copy?')) return

    // Now you have the ID to send to the backend!
    await fetch(`https://api.yourapp.com/${id}`, {
      method: 'DELETE'
    });

    // Update your UI to remove the item from the screen
    setCopies((prev) => prev.filter((c) => c.id !== id))
  }

  // #4 Download button
  const downloadMaster = async (pdfId, userToken) => {
  if (!pdfId || !userToken) {
    console.error("Missing required parameters");
    return;
  }

  try {
    const response = await fetch(`https://api.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.com/${pdfId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `report-${pdfId}.pdf`;
    
    document.body.appendChild(link);
    link.click();

    // Cleanup: Small delay ensures the browser registers the click before revocation
    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);

  } catch (error) {
    // Provide user feedback instead of just a console log
    alert("Could not download PDF. Please try again later.");
    console.error("Download Error:", error.message);
  }
};

function downloadCopy(copy) {
  alert(`Download for "${copy.name}" will be added later.`)
}

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>Master Resume</div>
          <div style={{ color: '#666', marginTop: 6 }}>
            Store a master resume template, then create tailored copies by quick edits.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {/* #3 Copy button */}
          <button style={outlineBtnBlue} onClick={createCopy}>
            + Copy Master
          </button>

          {/* #4 Download master */}
          <button style={outlineBtn} onClick={downloadMaster}>
            Download Master
          </button>

          {/* #5 Edit master */}
          <button style={primaryBtn} onClick={() => setIsEditMasterOpen(true)}>
            Edit Master
          </button>
        </div>
      </div>

      {/* Quick preview */}
      <div style={{ marginTop: 18, border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 950, marginBottom: 8 }}>Master Preview</div>
        <div style={{ color: '#333', fontWeight: 900 }}>
          {master.contact.fullName || '(Your Name)'}
        </div>
        <div style={{ color: '#555', marginTop: 4 }}>
          {[master.contact.email, master.contact.phone, master.contact.location].filter(Boolean).join(' • ') || '(Contact info)'}
        </div>
        {master.summary ? <div style={{ marginTop: 10, color: '#444' }}>{master.summary}</div> : null}
      </div>

      {/* Copies list */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>Resume Copies (Tailored)</div>

        {copies.length === 0 ? (
          <div style={{ color: '#777' }}>No copies yet. Click “+ Copy Master”.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {copies.map((c) => (
              <div
                key={c.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 12,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 950 }}>{c.name}</div>
                  <div style={{ color: '#666', marginTop: 4 }}>Created: {c.createdAt}</div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button style={outlineBtn} onClick={() => downloadCopy(c)}>
                    Download
                  </button>

                  <button style={outlineBtnBlue} onClick={() => setEditingCopyId(c.id)}>
                    Edit
                  </button>

                  <button style={dangerBtn} onClick={() => deleteCopy(c.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* #6 Editor form inside modal */}
      <ResumeEditorModal
        open={isEditMasterOpen}
        title="Edit Master Resume"
        initialValue={master}
        onClose={() => setIsEditMasterOpen(false)}
        onSave={saveMaster}
      />

      <ResumeEditorModal
        open={!!editingCopyId}
        title={editingCopy ? `Edit Resume Copy: ${editingCopy.name}` : 'Edit Resume Copy'}
        initialValue={editingCopy ? editingCopy.data : master}
        onClose={() => setEditingCopyId(null)}
        onSave={saveCopy}
      />
    </div>
  )
}

/* styles */
const primaryBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const outlineBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #ddd',
  background: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const outlineBtnBlue = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '2px solid #1f5eff',
  background: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const dangerBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #ffd1d1',
  background: '#fff5f5',
  fontWeight: 900,
  cursor: 'pointer',
}