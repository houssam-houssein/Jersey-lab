import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AdminLoginPage.css'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [forgotEmail, setForgotEmail] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setStatusType('error')
      setStatusMessage('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    setStatusType('info')
    setStatusMessage('Authenticating admin access...')

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      })

      if (!response.ok) {
        let errorMessage = 'Login failed'
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (parseError) {
          errorMessage = `Server error: ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Set authentication before navigation
      localStorage.setItem('isAdminAuthenticated', 'true')
      if (data.admin) {
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
      }
      
      setStatusType('success')
      setStatusMessage('Login successful. Redirecting...')
      
      // Navigate after a short delay to ensure localStorage is set
      setTimeout(() => {
        try {
          navigate('/admin', { replace: true })
        } catch (navError) {
          console.error('Navigation error:', navError)
          setStatusType('error')
          setStatusMessage('Login successful but navigation failed. Please refresh the page.')
        }
      }, 800)
    } catch (error) {
      console.error('Login error:', error)
      setStatusType('error')
      setStatusMessage(error.message || 'An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      setStatusType('error')
      setStatusMessage('Please enter your email address.')
      return
    }

    setIsLoading(true)
    setStatusType('info')
    setStatusMessage('Sending reset instructions...')

    try {
      const response = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setStatusType('success')
      setStatusMessage('If an admin account exists with this email, a password reset link has been sent. Check your inbox.')
      setForgotEmail('')
      setTimeout(() => {
        setShowForgotPassword(false)
      }, 3000)
    } catch (error) {
      console.error('Forgot password error:', error)
      setStatusType('error')
      setStatusMessage(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='admin-login-page'>
      <div className='admin-login-card'>
        <p className='eyebrow'>ADMIN ACCESS</p>
        <h1>JerseyLab Control Room</h1>
        <p className='subheading'>Private entry point for the owner. Manage drops, orders, and the entire catalog.</p>

        <form className='admin-login-form' onSubmit={handleLoginSubmit}>
          <div className='form-group'>
            <label htmlFor='admin-email'>Email</label>
            <input
              id='admin-email'
              name='email'
              type='email'
              placeholder='owner@jerzeylab.com'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='admin-password'>Password</label>
            <input
              id='admin-password'
              name='password'
              type='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-actions'>
            <button type='submit' className='primary-button' disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'enter dashboard'}
            </button>
            <button
              type='button'
              className='ghost-button'
              onClick={() => setShowForgotPassword(prev => !prev)}
            >
              {showForgotPassword ? 'Cancel' : 'Forgot password?'}
            </button>
          </div>
        </form>

        {showForgotPassword && (
          <div className='forgot-panel'>
            <p className='eyebrow'>RESET ACCESS</p>
            <p className='forgot-text'>Enter the admin email and we will send you a secure reset link.</p>
            <form onSubmit={handleForgotPassword} className='forgot-form'>
              <input
                type='email'
                placeholder='owner@jerzeylab.com'
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button type='submit' className='secondary-button'>Send reset link</button>
            </form>
          </div>
        )}

        {statusMessage && (
          <p className={`status-message ${statusType}`}>
            {statusMessage}
          </p>
        )}

        <Link to='/' className='back-link'>Return to storefront</Link>
      </div>
    </div>
  )
}

export default AdminLoginPage
