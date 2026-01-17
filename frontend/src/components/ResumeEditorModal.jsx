import { useEffect, useState } from 'react'

export default function ResumeEditorModal({ open, title, initialValue, onClose, onSave }) {
  const [draft, setDraft] = useState(initialValue)

  useEffect(() => {
    if (open) setDraft(initialValue)
  }, [open, initialValue])

  if (!open) return null

  function updateContact(field, value) {
    setDraft((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  function updateSection(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  function updateEducation(index, field, value) {
    setDraft((prev) => {
      const next = [...prev.education]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, education: next }
    })
  }

  function addEducation() {
    setDraft((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: '', degree: '', start: '', end: '', gpa: '' },
      ],
    }))
  }

  function removeEducation(index) {
    setDraft((prev) => {
      const next = prev.education.filter((_, i) => i !== index)
      return { ...prev, education: next.length ? next : prev.education }
    })
  }

  function updateExperience(index, field, value) {
    setDraft((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, experience: next }
    })
  }

  function updateExperienceBullets(index, bulletsText) {
  // keep EXACT text while typing (do not trim here)
  const bullets = bulletsText.split('\n')

  setDraft((prev) => {
    const next = [...prev.experience]
    next[index] = { ...next[index], bullets }
    return { ...prev, experience: next }
  })
}


  function addExperience() {
    setDraft((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', start: '', end: '', location: '', bullets: [] },
      ],
    }))
  }

  function removeExperience(index) {
    setDraft((prev) => {
      const next = prev.experience.filter((_, i) => i !== index)
      return { ...prev, experience: next.length ? next : prev.experience }
    })
  }

  function updateSkills(value) {
    setDraft((prev) => ({ ...prev, skillsText: value }))
  }

  function handleSave() {
    onSave(draft)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          width: '100%',
          maxWidth: 900,
          borderRadius: 14,
          padding: 16,
          border: '1px solid #eee',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* CONTACT */}
        <SectionTitle>Contact</SectionTitle>
        <Grid2>
          <Field label="Full Name" value={draft.contact.fullName} onChange={(v) => updateContact('fullName', v)} />
          <Field label="Email" value={draft.contact.email} onChange={(v) => updateContact('email', v)} />
          <Field label="Phone" value={draft.contact.phone} onChange={(v) => updateContact('phone', v)} />
          <Field label="Location" value={draft.contact.location} onChange={(v) => updateContact('location', v)} />
          <Field label="LinkedIn" value={draft.contact.linkedin} onChange={(v) => updateContact('linkedin', v)} />
          <Field label="Website" value={draft.contact.website} onChange={(v) => updateContact('website', v)} />
        </Grid2>

        {/* SUMMARY */}
        <SectionTitle>Summary</SectionTitle>
        <textarea
          value={draft.summary}
          onChange={(e) => updateSection('summary', e.target.value)}
          style={{ ...inputStyle, height: 90, resize: 'vertical' }}
          placeholder="1–3 lines about you..."
        />

        {/* EDUCATION */}
        <SectionTitle>Education</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {draft.education.map((ed, i) => (
            <Card key={i}>
              <Grid2>
                <Field label="School" value={ed.school} onChange={(v) => updateEducation(i, 'school', v)} />
                <Field label="Degree" value={ed.degree} onChange={(v) => updateEducation(i, 'degree', v)} />
                <Field label="Start" value={ed.start} onChange={(v) => updateEducation(i, 'start', v)} />
                <Field label="End" value={ed.end} onChange={(v) => updateEducation(i, 'end', v)} />
                <Field label="GPA" value={ed.gpa} onChange={(v) => updateEducation(i, 'gpa', v)} />
              </Grid2>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={dangerBtn} onClick={() => removeEducation(i)} type="button">
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
        <button style={secondaryBtn} onClick={addEducation} type="button">
          + Add Education
        </button>

        {/* EXPERIENCE */}
        <SectionTitle>Experience</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {draft.experience.map((ex, i) => (
            <Card key={i}>
              <Grid2>
                <Field label="Company" value={ex.company} onChange={(v) => updateExperience(i, 'company', v)} />
                <Field label="Role" value={ex.role} onChange={(v) => updateExperience(i, 'role', v)} />
                <Field label="Location" value={ex.location} onChange={(v) => updateExperience(i, 'location', v)} />
                <Field label="Start" value={ex.start} onChange={(v) => updateExperience(i, 'start', v)} />
                <Field label="End" value={ex.end} onChange={(v) => updateExperience(i, 'end', v)} />
              </Grid2>

              <div style={{ fontWeight: 800, marginTop: 8, marginBottom: 4 }}>Bullets (one per line)</div>
              <textarea
                value={(ex.bullets || []).join('\n')}
                onChange={(e) => updateExperienceBullets(i, e.target.value)}
                style={{ ...inputStyle, height: 90, resize: 'vertical' }}
                placeholder="- Built ...&#10;- Improved ..."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={dangerBtn} onClick={() => removeExperience(i)} type="button">
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
        <button style={secondaryBtn} onClick={addExperience} type="button">
          + Add Experience
        </button>

        {/* SKILLS */}
        <SectionTitle>Skills</SectionTitle>
        <textarea
          value={draft.skillsText}
          onChange={(e) => updateSkills(e.target.value)}
          style={{ ...inputStyle, height: 90, resize: 'vertical' }}
          placeholder="Example: Languages: Python, JavaScript&#10;Frameworks: React, Django&#10;Tools: Git, Docker"
        />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
          <button type="button" onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

/* Small helper components */
function SectionTitle({ children }) {
  return <div style={{ marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: 950 }}>{children}</div>
}

function Grid2({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {children}
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label>
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  )
}

function Card({ children }) {
  return <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>{children}</div>
}

const inputStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ddd',
  outline: 'none',
}

const primaryBtn = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const secondaryBtn = {
  marginTop: 10,
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #ddd',
  background: 'white',
  fontWeight: 900,
  cursor: 'pointer',
}

const dangerBtn = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #ffd1d1',
  background: '#fff5f5',
  fontWeight: 900,
  cursor: 'pointer',
}
