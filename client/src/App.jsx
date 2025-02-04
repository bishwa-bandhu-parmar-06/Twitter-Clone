import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Header from './Components/Header'
import Footer from './Components/Footer'
import Dashboard from './pages/Dashboard'
import AuthForm from './Components/AuthForm'
import ForgotPassword from './Components/ForgotPassword'
const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<AuthForm type="login" />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App