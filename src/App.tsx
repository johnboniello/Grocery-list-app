import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DietFilterProvider } from './contexts/DietFilterContext'
import { ThisWeekScreen } from './screens/ThisWeekScreen'
import { StaticListScreen } from './screens/StaticListScreen'
import { CatalogScreen } from './screens/CatalogScreen'
import highFrequencySeed from './firebase/seedData/highFrequency.json'
import lessFrequentSeed from './firebase/seedData/lessFrequent.json'

function App() {
  return (
    <DietFilterProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/this-week" replace />} />
          <Route path="/this-week" element={<ThisWeekScreen />} />
          <Route
            path="/high-frequency"
            element={<StaticListScreen seedRows={highFrequencySeed} sourceList="highFrequency" />}
          />
          <Route
            path="/less-frequent"
            element={<StaticListScreen seedRows={lessFrequentSeed} sourceList="lessFrequent" />}
          />
          <Route path="/catalog" element={<CatalogScreen />} />
        </Routes>
      </AppShell>
    </DietFilterProvider>
  )
}

export default App
