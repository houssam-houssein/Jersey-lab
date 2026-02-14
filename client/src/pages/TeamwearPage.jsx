import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import './TeamwearPage.css'

const TeamwearPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    description: '',
    designFiles: []
  })
  const [filePreviews, setFilePreviews] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    if (type === 'file') {
      if (files && files.length > 0) {
        const newFiles = Array.from(files).slice(0, 5 - formData.designFiles.length) // Limit to 5 total
        const updatedFiles = [...formData.designFiles, ...newFiles].slice(0, 5) // Ensure max 5
        
        // Create previews for all files
        const createPreviews = async () => {
          const previews = []
          for (const file of updatedFiles) {
            if (file.type && file.type.startsWith('image/')) {
              try {
                const preview = await new Promise((resolve, reject) => {
                  const reader = new FileReader()
                  reader.onload = () => resolve(reader.result)
                  reader.onerror = reject
                  reader.readAsDataURL(file)
                })
                previews.push({ file, preview })
              } catch (error) {
                previews.push({ file, preview: null })
              }
            } else {
              previews.push({ file, preview: null })
            }
          }
          setFilePreviews(previews)
        }
        
        setFormData(prev => ({
          ...prev,
          [name]: updatedFiles
        }))
        
        createPreviews()
      }
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const removeFile = (index) => {
    const updatedFiles = formData.designFiles.filter((_, i) => i !== index)
    const updatedPreviews = filePreviews.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      designFiles: updatedFiles
    }))
    setFilePreviews(updatedPreviews)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Convert files to base64 array
      const designFilesData = []
      
      if (formData.designFiles && formData.designFiles.length > 0) {
        for (const file of formData.designFiles) {
          const reader = new FileReader()
          const base64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          designFilesData.push({
            file: base64,
            fileName: file.name,
            fileType: file.type
          })
        }
      }
      
      const response = await fetch(`${API_URL}/api/teamwear-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          description: formData.description,
          designFiles: designFilesData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        description: '',
        designFiles: []
      })
      setFilePreviews([])
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Show success message
      setShowSuccessMessage(true)
      
      // Scroll to top to show the message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    } catch (error) {
      console.error('Failed to submit teamwear inquiry:', error)
      alert('Failed to submit your inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="teamwear-page">
      <Link to="/" className="close-button" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      
      <h1 className="teamwear-title">Teamwear</h1>
      
      <p className="teamwear-subtitle">
        Fill out the form below to request custom teamwear for your team.
      </p>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message-container">
          <div className="success-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div className="success-message-text">
              <h3 className="success-message-title">Thank you for your inquiry!</h3>
              <p className="success-message-detail">We will contact you soon.</p>
            </div>
            <button 
              className="success-message-close"
              onClick={() => setShowSuccessMessage(false)}
              aria-label="Close message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      <form className="teamwear-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="6"
            placeholder="Tell us about your teamwear needs, quantity, design preferences, etc."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="designFiles" className="form-label">
            Upload Reference Photos (optional, up to 5)
          </label>
          <input
            type="file"
            id="designFiles"
            name="designFiles"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="form-file-input"
            ref={fileInputRef}
            disabled={formData.designFiles.length >= 5}
          />
          <p className="form-help-text">
            Accepted formats: JPG, PNG, GIF. Max size 10MB per file. You can upload up to 5 photos.
            {formData.designFiles.length > 0 && ` (${formData.designFiles.length}/5 uploaded)`}
          </p>
          
          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="file-previews-container">
              {filePreviews.map((preview, index) => (
                <div key={index} className="file-preview-item">
                  {preview.preview ? (
                    <img 
                      src={preview.preview} 
                      alt={`Preview ${index + 1}`}
                      className="file-preview-image"
                    />
                  ) : (
                    <div className="file-preview-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                  )}
                  <div className="file-preview-info">
                    <p className="file-preview-name">{preview.file.name}</p>
                    <button
                      type="button"
                      className="file-preview-remove"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${preview.file.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default TeamwearPage

