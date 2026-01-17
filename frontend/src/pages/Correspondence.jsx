import { useState } from 'react'
import ComposeEmailModal from '../components/ComposeEmailModal'

export default function Correspondence() {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [sentLog, setSentLog] = useState([])

  function onSendEmail(email) {
    setSentLog((prev) => [email, ...prev])
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>Correspondence</div>
          <div style={{ color: '#666', marginTop: 6 }}>
            Keep track of your messages with recruiters and companies.
          </div>
        </div>

        {/* ✅ #8 Compose email button */}
        <button
          onClick={() => setIsComposeOpen(true)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #1f5eff',
            background: 'white',
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Compose Email
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>Sent Log (local for now)</div>

        {sentLog.length === 0 ? (
          <div style={{ color: '#777' }}>No emails yet. Click “Compose Email”.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sentLog.map((e) => (
              <div key={e.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 900 }}>{e.subject || '(No subject)'}</div>
                <div style={{ color: '#444', marginTop: 4 }}>To: {e.to}</div>
                <div style={{ color: '#666', marginTop: 6, whiteSpace: 'pre-wrap' }}>{e.body || '(Empty message)'}</div>
                <div style={{ color: '#888', marginTop: 8, fontSize: 12 }}>{e.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ComposeEmailModal
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={onSendEmail}
      />
    </div>
  )
}
