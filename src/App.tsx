import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PrototypeProvider } from './context/PrototypeContext'
import { AppShell } from './layouts/AppShell'
import { CompletedPage } from './pages/CompletedPage'
import { GoalPage } from './pages/GoalPage'
import { LandingPage } from './pages/LandingPage'
import { PaymentPage } from './pages/PaymentPage'
import { PlanningPage } from './pages/PlanningPage'
import { ReviewPage } from './pages/ReviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionDetailsPage } from './pages/TransactionDetailsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { OffersPage } from './pages/OffersPage'
import { ScrollToTop } from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <PrototypeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppShell />}>
            <Route path="/new" element={<GoalPage />} />
            <Route path="/plan" element={<PlanningPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/vendors" element={<Navigate to="/offers" replace />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PrototypeProvider>
  )
}

export default App
