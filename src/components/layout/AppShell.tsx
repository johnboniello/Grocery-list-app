import type { ReactNode } from 'react'
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
        <h1 className="app-shell__title">Grocery List</h1>
        <DietToggleBar activeRestrictions={activeRestrictions} onToggle={toggle} />
      </header>
      <main className="app-shell__content">{children}</main>
      <TabBar />
    </div>
  )
}
