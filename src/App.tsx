import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AddDocumentDialogProvider } from '@/components/AddDocumentDialogProvider'
import { AppShell } from '@/components/layout/AppShell'
import Categories from '@/pages/Categories'
import Dashboard from '@/pages/Dashboard'
import Documents from '@/pages/Documents'
import NotFound from '@/pages/NotFound'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AddDocumentDialogProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AddDocumentDialogProvider>
    </BrowserRouter>
  )
}