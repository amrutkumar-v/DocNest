import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { AddDocumentDialogProvider } from '@/components/AddDocumentDialogProvider'
import { AppShell } from '@/components/layout/AppShell'
import { AuthProvider } from '@/context/AuthProvider'
import Categories from '@/pages/Categories'
import Dashboard from '@/pages/Dashboard'
import Documents from '@/pages/Documents'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Settings from '@/pages/Settings'

/**
 * Route table.
 *
 * `/login` is public (and redirects signed-in users to the dashboard);
 * everything else sits behind `RequireAuth`.
 *
 * Exported separately from `App` so tests can supply their own router.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        }
      />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AddDocumentDialogProvider>
          <AppRoutes />
        </AddDocumentDialogProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}