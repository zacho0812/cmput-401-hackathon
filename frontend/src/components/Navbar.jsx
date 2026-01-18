import { NavLink } from 'react-router-dom'

const linkStyle = ({ isActive }) => ({
  padding: '10px 12px',
  borderRadius: 8,
  textDecoration: 'none',
  color: isActive ? 'white' : '#376E8C',
  background: isActive ? '#376E8C' : 'transparent',
})

export default function Navbar() {
  return (
    <div style={{ borderBottom: '1px solid #eee', padding: 12 }}>
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 800 }}>Job Organizer</div>

        <nav style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
          <NavLink to="/jobs" style={linkStyle}>
            Job Tracker
          </NavLink>

          <NavLink to="/resume" style={linkStyle}>
            Master Resume
          </NavLink>

          <NavLink to="/correspondence" style={linkStyle}>
            Correspondence
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
