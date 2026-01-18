import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import JobTracker from './pages/JobTracker'
import MasterResume from './pages/MasterResume'
import Correspondence from './pages/Correspondence'

export default function App() {
  const location = useLocation()

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
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<PageWrapper><JobTracker /></PageWrapper>} />
            <Route path="/resume" element={<PageWrapper><MasterResume /></PageWrapper>} />
            <Route path="/correspondence" element={<PageWrapper><Correspondence /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  )
}

// PageWrapper defined inside the same file
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
