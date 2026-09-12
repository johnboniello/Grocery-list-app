import { NavLink } from 'react-router-dom'
import './TabBar.css'

const TABS = [
  { to: '/this-week', label: 'This Week' },
  { to: '/high-frequency', label: 'High Freq' },
  { to: '/less-frequent', label: 'Less Freq' },
  { to: '/catalog', label: 'Catalog' },
]

export function TabBar() {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `tab-bar__tab${isActive ? ' tab-bar__tab--active' : ''}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
