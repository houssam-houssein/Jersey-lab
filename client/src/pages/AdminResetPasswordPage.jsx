import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './AdminResetPasswordPage.css'

const AdminResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (!token) {
      setStatusType('error')
      setStatusMessage('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setStatusMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setStatusType('error')
      setStatusMessage('Invalid reset link.')
      return
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setStatusType('error')
      setStatusMessage('Please fill in all fields.')
      return
    }

    if (formData.newPassword.length < 6) {
      setStatusType('error')
      setStatusMessage('Password must be at least 6 characters long.')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setStatusType('error')
      setStatusMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setStatusType('info')
    setStatusMessage('Resetting password...')

    try {
      const response = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setStatusType('success')
      setStatusMessage('Password reset successfully! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/admin-login', { replace: true })
      }, 2000)
    } catch (error) {
      console.error('Password reset error:', error)
      setStatusType('error')
      setStatusMessage(error.message || 'An error occurred. Please try again or request a new reset link.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='admin-reset-password-page'>
      <div className='admin-reset-password-card'>
        <p className='eyebrow'>PASSWORD RESET</p>
        <h1>Reset Admin Password</h1>
        <p className='subheading'>Enter your new password below.</p>

        {!token ? (
          <div className='error-panel'>
            <p className='error-text'>Invalid reset link. Please request a new password reset from the login page.</p>
            <button
              type='button'
              className='primary-button'
              onClick={() => navigate('/admin-login')}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form className='admin-reset-form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='new-password'>New Password</label>
              <input
                id='new-password'
                name='newPassword'
                type='password'
                placeholder='Enter new password (min. 6 characters)'
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='confirm-password'>Confirm Password</label>
              <input
                id='confirm-password'
                name='confirmPassword'
                type='password'
                placeholder='Confirm new password'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>

            <div className='form-actions'>
              <button type='submit' className='primary-button' disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type='button'
                className='ghost-button'
                onClick={() => navigate('/admin-login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {statusMessage && (
          <p className={`status-message ${statusType}`}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminResetPasswordPage

