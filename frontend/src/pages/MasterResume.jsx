import { useEffect, useMemo, useState } from 'react'
import ResumeEditorModal from '../components/ResumeEditorModal'
import { downloadJson } from '../utils/download'
import { jsPDF } from "jspdf";

const STORAGE_KEY = 'job-organizer-master-resume'
const COPIES_KEY = 'job-organizer-resume-copies'
const API_URL = 'https://api.OOOOYOYOYOYOYOYOY-DATABASEEEEEEEEE.com'

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
  const editingCopy = useMemo(() => copies.find((c) => c.id === editingCopyId) || null, [copies, editingCopyId])



  
  useEffect(() => {
  // 1. Load instantly from cache (The "Stale" data)
  const cachedMaster = localStorage.getItem(STORAGE_KEY);
  const cachedCopies = localStorage.getItem(COPIES_KEY);
  if (cachedMaster) setMaster(JSON.parse(cachedMaster));
  if (cachedCopies) setCopies(JSON.parse(cachedCopies));

  // 2. Revalidate from API (Background check)
  const syncWithServer = async () => {
    // Graceful exit if API is not configured
    if (API_URL.includes('PPPpppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppP')) return; 

    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setMaster(data.master);
        setCopies(data.copies);
        // Silently update cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.master));
        localStorage.setItem(COPIES_KEY, JSON.stringify(data.copies));
      }
    } catch (err) {
      console.log("Database offline. Using local version.");
    }
  };
  syncWithServer();
}, []);




 

  async function getResume(id) {
  // 1. LOCAL CHECK: Look in your app's memory first
  // Check if the ID matches the Master or any of the Tailored Copies
  const localMatch = (master.id === id) 
    ? master 
    : copies.find(c => c.id === id);

  if (localMatch) {
    console.log("Found resume in local memory.");
    return localMatch.id;
  }

  // 2. DATABASE CHECK: If not found locally, try the API
  try {
    // Note: Use backticks (`) for the template literal to work
    const response = await fetch(`https://api.YOOOOOOOOUR-DATATATATTABASESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.com/${id}`);
    
    if (!response.ok) throw new Error("Not found on server");

    const data = await response.json();
    return data.id; 
  } catch (err) {
    // 3. FALLBACK: If both fail, log the error and return the ID you were given
    console.warn("Could not find resume on server, using provided ID as fallback.");
    return id; 
  }
}






  async function createCopy(masterId) {
  const name = prompt('Name this resume copy:');
  if (!name) return;

  try {
    // FIXED: Added backticks and slash /
    const response = await fetch(`${API_URL}/resumes/${masterId}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() })
    });

    if (!response.ok) throw new Error('Database unreachable');

    const newResumeCopy = await response.json();
    setCopies((prev) => [newResumeCopy, ...prev]);
    setEditingCopyId(newResumeCopy.id);

  } catch (error) {
    console.warn("Database error, creating local copy instead.");

    const localNewCopy = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      data: { ...master }, 
      createdAt: new Date().toISOString()
    };

    // FIXED: Use functional update to avoid stale 'copies' variable
    setCopies((prev) => {
      const updated = [localNewCopy, ...prev];
      localStorage.setItem(COPIES_KEY, JSON.stringify(updated));
      return updated;
    });
    
    setEditingCopyId(localNewCopy.id);
  }
}

async function saveMaster(masterId, updatedContent) {
  // 1. UPDATE LOCALLY FIRST
  const localUpdate = {
    ...master,
    ...updatedContent,
    lastModified: new Date().toISOString()
  };

  setMaster(localUpdate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localUpdate));

  // 2. DATABASE SYNC
  try {
    // FIXED: Added backticks and slash /
    const response = await fetch(`${API_URL}/resumes/${masterId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localUpdate)
    });

    if (response.ok) {
      const serverVersion = await response.json();
      setMaster(serverVersion);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverVersion));
    }
  } catch (error) {
    console.warn("Operating in Local-Only mode.");
  }
}





  async function saveCopy(id, updatedData) {
    // 1. Update UI and LocalStorage immediately (Optimistic Update)
    const newCopies = copies.map((c) => (c.id === id ? { ...c, data: updatedData } : c));
    setCopies(newCopies);
    localStorage.setItem(COPIES_KEY, JSON.stringify(newCopies));

    // 2. Try to sync with Database
    try {
      const response = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });

      if (response.ok) {
        console.log("Successfully synced with Database");
      } else {
        console.warn("Database rejected update, but saved locally.");
      }
    } catch (error) {
      console.error("Network error. Changes saved to this device only.");
    }
}






  // Deletes Copy, Includes Backend
    async function deleteCopy(id) { // WORKS WITH AND WITHOUT DATA BASE
  if (!confirm('Delete this resume copy?')) return;

  // 1. LOCAL UPDATE FIRST (Immediate UI response)
  // We update state and LocalStorage immediately so the item vanishes instantly
  setCopies((prev) => {
    const updated = prev.filter((c) => c.id !== id);
    localStorage.setItem(COPIES_KEY, JSON.stringify(updated));
    return updated;
  });

  // 2. DATABASE SYNC (Background)
  // We wrap the fetch in a try/catch so the app doesn't crash if offline
  try {
    // Note: Ensure your API_URL and ID are correctly formatted with backticks
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn("Server delete failed, but item removed from this device.");
    } else {
      console.log("Successfully deleted from Database");
    }
  } catch (error) {
    // If the network fails, the local delete is already done
    console.warn("Operating in Local-Only mode. Changes saved to this browser.");
  }
}





  // #4 Download button
  const downloadMaster = async (pdfId) => { // WORKS WITH AND WITHOUT DATABASE
  // --- 1. TRY SERVER-SIDE PDF (Professional Version) ---
  try {
    if (API_URL && !API_URL.includes('PPPP')) {
      const response = await fetch(`${API_URL}/resumes/${pdfId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-${pdfId}.pdf`;
        link.click();
        return; // Exit if server download succeeds
      }
    }
  } catch (error) {
    console.warn("Server PDF failed, switching to Front-End generation.");
  }

  // --- 2. FRONT-END FALLBACK (Offline Version) ---
  try {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Set Font & Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(master.contact.fullName || "Resume", margin, y);
    
    // Contact Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 10;
    const contactLine = [master.contact.email, master.contact.phone, master.contact.location]
      .filter(Boolean).join(" | ");
    doc.text(contactLine, margin, y);

    // Summary Section
    if (master.summary) {
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("SUMMARY", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(master.summary, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 5);
    }

    // Skills Section
    if (master.skillsText) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(master.skillsText, margin, y);
    }

    // Save the PDF
    doc.save(`resume-client-side.pdf`);
    
  } catch (err) {
    alert("Could not generate PDF locally.");
    console.error(err);
  }
};





const downloadCopy = async (copy) => { // WORKS WITH AND WITHOUT DATABASE
  if (!copy?.id) {
    console.error("Missing copy data");
    return;
  }

  // --- 1. TRY SERVER-SIDE PDF (Preferred) ---
  try {
    if (API_URL && !API_URL.includes('PPPP')) {
      const response = await fetch(`${API_URL}/resumes/${copy.id}/pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${copy.name || 'resume'}.pdf`;
        link.click();
        
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        return; 
      }
    }
  } catch (error) {
    console.warn("Database offline: Switching to Client-Side PDF generation.");
  }

  // --- 2. FRONT-END FALLBACK (Client-Side Generation) ---
  try {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;
    
    // Access the tailored data from the copy object
    const data = copy.data;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(data.contact.fullName || "Resume", margin, y);
    
    // Sub-header (Contact)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 10;
    const contactLine = [data.contact.email, data.contact.phone, data.contact.location]
      .filter(Boolean).join(" | ");
    doc.text(contactLine, margin, y);

    // Summary Section
    if (data.summary) {
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("SUMMARY", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(data.summary, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 5);
    }

    // Skills Section
    if (data.skillsText) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(data.skillsText, margin, y);
    }

    doc.save(`${copy.name || 'resume-copy'}.pdf`);

  } catch (err) {
    alert("Local PDF generation failed. Please check your data.");
    console.error("Local PDF Error:", err);
  }
};



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
          <button style={outlineBtnBlue} onClick={() => createCopy(master.id)}>
            + Copy Master
            </button>

          {/* #4 Download master */}
          <button style={outlineBtn} onClick={() => downloadMaster(master.id)}>
            Download Master
            </button>

          {/* #5 Edit master */}
          <button style={primaryBtn} onClick={() => setIsEditMasterOpen(true)}>
            Edit Master</button>
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
                  <button style={outlineBtn} onClick={() => downloadCopy(c)}>Download</button>
        
                  <button style={outlineBtnBlue} onClick={() => setEditingCopyId(c.id)}>Edit</button>
        
                 <button style={dangerBtn} onClick={() => deleteCopy(c.id)}>Delete</button>
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
      id={master.id} 
      onSave={saveMaster}
      onClose={() => setIsEditMasterOpen(false)}
    />

    <ResumeEditorModal
      open={!!editingCopyId}
      title={editingCopy ? `Edit Resume Copy: ${editingCopy.name}` : 'Edit Resume Copy'}
      initialValue={editingCopy ? editingCopy.data : master}
      id={editingCopyId}
      onSave={saveCopy}
      onClose={() => setEditingCopyId(null)}
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