import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import lebronImage from '../assets/images/lebron.png'
import leonardImage from '../assets/images/leonard.png'
import './ProfessionalAthletesPage.css'

const professionalAthletes = [
  {
    id: 'lebron',
    name: 'LeBron James',
    image: lebronImage,
    price: '$179.00'
  },
  {
    id: 'leonard',
    name: 'Kawhi Leonard',
    image: leonardImage,
    price: '$169.00'
  }
]

const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const ProfessionalAthletesPage = () => {
  const { addToCart } = useCart()
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizeError, setShowSizeError] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleImageClick = (athlete) => {
    setSelectedAthlete(athlete)
    setSelectedSize('')
    setShowSizeError(false)
  }

  const handleCloseModal = () => {
    setSelectedAthlete(null)
    setSelectedSize('')
    setShowSizeError(false)
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setShowSizeError(false)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true)
      return
    }
    
    // Add item to cart
    addToCart({
      id: selectedAthlete.id,
      name: selectedAthlete.name,
      image: selectedAthlete.image,
      price: selectedAthlete.price,
      size: selectedSize
    })
    
    handleCloseModal()
    
    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <div className="professional-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">Professional Athletes Collection</h1>
        <p className="page-subtitle">
          Shop the latest drops from your favorite overseas pros and elite hoopers. Every jersey is verified, game-ready, and ships with a certificate of authenticity.
        </p>
      </header>

      <section className="athletes-grid" aria-label="Professional athlete jerseys">
        {professionalAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="athlete-image-card"
            onClick={() => handleImageClick(athlete)}
          >
            <img src={athlete.image} alt={athlete.name} className="athlete-image" />
            <div className="athlete-overlay">
              <h2 className="athlete-name-overlay">{athlete.name}</h2>
            </div>
          </div>
        ))}
      </section>

      {/* Modal/Cart */}
      {selectedAthlete && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-body">
              <div className="modal-image-container">
                <img src={selectedAthlete.image} alt={selectedAthlete.name} className="modal-image" />
              </div>
              <div className="modal-info">
                <h2 className="modal-athlete-name">{selectedAthlete.name}</h2>
                <p className="modal-price">{selectedAthlete.price}</p>
                
                <div className="size-selection">
                  <h3 className="size-title">Select Size</h3>
                  <div className="size-options">
                    {shirtSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {showSizeError && (
                    <p className="size-error-message">Please select a size</p>
                  )}
                </div>

                <button
                  type="button"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="support-section">
        <h3 className="support-title">Need a custom order?</h3>
        <p className="support-copy">
          Contact our concierge team for player-signed memorabilia, bulk orders, or jersey personalization.
        </p>
        <a className="support-link" href="mailto:sales@jerzeylab.com">
          sales@jerzeylab.com
        </a>
      </section>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-message-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Item added to cart successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalAthletesPage


