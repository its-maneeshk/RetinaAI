import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Screening } from './pages/Screening'
import { ScreeningHistoryPage } from './pages/ScreeningHistory'
import { ScreeningDetails } from './pages/ScreeningDetails'
import { Education } from './pages/Education'
import { ModelInformation } from './pages/ModelInformation'
import { NotFound } from './pages/NotFound'
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="screening" element={<Screening />} />
          <Route path="history" element={<ScreeningHistoryPage />} />
          <Route path="history/:recordId" element={<ScreeningDetails />} />
          <Route path="education" element={<Education />} />
          <Route path="model" element={<ModelInformation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
