import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './pages/Layout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'
import { Toaster } from 'react-hot-toast'
import PublishPage from './pages/PublishPage'

const App = () => {
  return (
    <>
    <Toaster/>
    <Routes>
      {/* Login routes */}
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      {/* Protected routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
      </Route>

      <Route path='/publish/:id' element={<PublishPage/>}/>

      {/**Catch-all */}

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
    </>

    
  )
}

export default App