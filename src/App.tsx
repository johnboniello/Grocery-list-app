import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DietFilterProvider } from './contexts/DietFilterContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { HouseholdProvider, useHousehold } from './contexts/HouseholdContext'
import { ThisWeekScreen } from './screens/ThisWeekScreen'
import { StaticListScreen } from './screens/StaticListScreen'
import { CatalogScreen } from './screens/CatalogScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { SettingsScreen } from './screens/SettingsScreen'

function AppRoutes() {
  const { loading: authLoading } = useAuth()
  const { householdId, loading: householdLoading, justRevoked, dismissRevoked } = useHousehold()

  if (authLoading || householdLoading) {
    return <p style={{ textAlign: 'center', marginTop: 48 }}>Loading…</p>
  }

  if (!householdId) {
    return (
      <>
        {justRevoked && (
          <p style={{ textAlign: 'center', color: 'var(--fail-text)', padding: '12px 16px' }}>
            This device was removed from its household.{' '}
            <button type="button" onClick={dismissRevoked}>
              Dismiss
            </button>
          </p>
        )}
        <OnboardingScreen />
      </>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/this-week" replace />} />
        <Route path="/this-week" element={<ThisWeekScreen />} />
        <Route path="/high-frequency" element={<StaticListScreen listName="highFrequency" />} />
        <Route path="/less-frequent" element={<StaticListScreen listName="lessFrequent" />} />
        <Route path="/catalog" element={<CatalogScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <AuthProvider>
      <HouseholdProvider>
        <DietFilterProvider>
          <AppRoutes />
        </DietFilterProvider>
      </HouseholdProvider>
    </AuthProvider>
  )
}

export default App
