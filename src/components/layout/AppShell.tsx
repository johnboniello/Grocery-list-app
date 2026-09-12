import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DietToggleBar } from '../diet/DietToggleBar'
import { TabBar } from './TabBar'
import { useDietFilterContext } from '../../contexts/DietFilterContext'
import './AppShell.css'

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  const { activeRestrictions, toggle } = useDietFilterContext()

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__title-row">
          <div className="app-shell__brand">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3f6b4a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 11 13 11 10"></path>
            </svg>
            <h1 className="app-shell__title">Grocery List</h1>
          </div>
          <Link to="/settings" className="app-shell__settings" aria-label="Household settings">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </Link>
        </div>
        <DietToggleBar activeRestrictions={activeRestrictions} onToggle={toggle} />
      </header>
      <main className="app-shell__content">{children}</main>
      <TabBar />
    </div>
  )
}
