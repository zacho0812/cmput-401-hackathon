import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import JobTracker from './pages/JobTracker'
import MasterResume from './pages/MasterResume'
import Correspondence from './pages/Correspondence'

export default function App() {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: '24px',
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobTracker />} />
          <Route path="/resume" element={<MasterResume />} />
          <Route path="/correspondence" element={<Correspondence />} />
        </Routes>
      </div>
    </>
  )
}
