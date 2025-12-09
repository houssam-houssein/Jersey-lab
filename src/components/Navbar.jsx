import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logo from '../assets/images/logo.png'
import './Navbar.css'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { getCartItemCount } = useCart()
  const cartItemCount = getCartItemCount()

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }


  const handleAboutUsClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      // Already on homepage, scroll to section
      const section = document.getElementById('about-us')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage then scroll
      navigate('/#about-us')
      setTimeout(() => {
        const section = document.getElementById('about-us')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Jerzey LAB" className="logo-img" />
          </Link>
        </div>

        {/* Right Side - All content except logo */}
        <div className="navbar-right-group">
          {/* Navigation Links */}
          <div className="navbar-links">
            <Link to="/professional-athletes" className="nav-link">
              PROFESSIONAL ATHLETES
            </Link>
            <Link to="/influencers" className="nav-link">
              INFLUENCERS
            </Link>
            <Link to="/high-school-athletes" className="nav-link">
              HIGH SCHOOL ATHLETES
            </Link>
            <Link to="/teamwear" className="nav-link">
              TEAMWEAR
            </Link>
            <a href="#about-us" className="nav-link" onClick={handleAboutUsClick}>
              ABOUT
            </a>
            <Link to="/shipping-returns" className="nav-link">
              SHIPPING & RETURNS
            </Link>
            <Link to="/terms-conditions" className="nav-link">
              TERMS & CONDITIONS
            </Link>
          </div>

          {/* Search and Login */}
          <div className="navbar-right">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="SEARCH..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
            <Link to="/cart" className="cart-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            <Link to="/login" className="login-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

