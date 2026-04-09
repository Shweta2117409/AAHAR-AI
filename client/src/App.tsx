import { Route, Routes } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import { AaharStoreProvider } from './state/AaharStore'

export default function App() {
  return (
    <AaharStoreProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
        </Route>
      </Routes>
    </AaharStoreProvider>
  )
}
