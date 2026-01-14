import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import bgPoster from '../assets/images/bg-poster.png'
import logoPoster from '../assets/images/logo-poster.png'
import aboutBg from '../assets/images/about-bg.png'
import paBg from '../assets/images/pa.png'
import iBg from '../assets/images/i.png'
import haBg from '../assets/images/ha.png'
import twBg from '../assets/images/tw.png'
import p1 from '../assets/images/p1.png'
import p2 from '../assets/images/p2.png'
import p3 from '../assets/images/p3.png'
import p4 from '../assets/images/p4.png'
import p5 from '../assets/images/p5.png'
import p6 from '../assets/images/p6.png'
import p7 from '../assets/images/p7.png'
import p8 from '../assets/images/p8.png'
import p9 from '../assets/images/p9.png'
import p10 from '../assets/images/p10.png'
import p11 from '../assets/images/p11.png'
import p12 from '../assets/images/p12.png'
import p13 from '../assets/images/p13.png'
import './HomePage.css'

const HomePage = () => {
  const location = useLocation()
  const { checkAuth } = useAuth()
  
  // Photo rotation state
  const photos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13]
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Handle scrolling to sections when navigating from navbar
    if (location.hash) {
      const sectionId = location.hash.substring(1)
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }

    // Check if user just logged in
    if (location.search.includes('login=success')) {
      checkAuth()
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [location, checkAuth])

  // Photo rotation effect
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }, 3000) // Change photo every 3 seconds

    return () => clearInterval(interval)
  }, [photos.length, isPaused])

  // Swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }
    if (isRightSwipe) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
    }
    
    // Resume auto-rotation after a delay
    setTimeout(() => setIsPaused(false), 3000)
  }

  // Mouse drag handlers for desktop
  const [mouseStart, setMouseStart] = useState(null)
  const [mouseEnd, setMouseEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const onMouseDown = (e) => {
    setMouseStart(e.clientX)
    setIsDragging(true)
    setIsPaused(true)
  }

  const onMouseMove = (e) => {
    if (isDragging) {
      setMouseEnd(e.clientX)
    }
  }

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd || !isDragging) {
      setIsDragging(false)
      setIsPaused(false)
      return
    }
    
    const distance = mouseStart - mouseEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }
    if (isRightSwipe) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
    }
    
    setIsDragging(false)
    setMouseStart(null)
    setMouseEnd(null)
    // Resume auto-rotation after a delay
    setTimeout(() => setIsPaused(false), 3000)
  }


  return (
    <div className="homepage">
      <div className="homepage-content">
        {/* Main Poster */}
        <div className="main-logo">
          <img src={bgPoster} alt="JerseyLab Background" className="main-poster-bg" />
          <img src={logoPoster} alt="JerseyLab Logo" className="main-poster-logo" />
        </div>
      </div>
      
      {/* Rotating Photos Section */}
      <div className="rotating-photos-section">
        <div 
          className="rotating-photos-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`JerseyLab Gallery ${index + 1}`}
              className={`rotating-photo ${index === currentPhotoIndex ? 'active' : ''}`}
              draggable={false}
            />
          ))}
          
          {/* Navigation Dots - Only 3 dots in a line, rotates with photos */}
          <div className="photo-navigation-dots">
            {[
              (currentPhotoIndex - 1 + photos.length) % photos.length, // Previous
              currentPhotoIndex, // Current
              (currentPhotoIndex + 1) % photos.length // Next
            ].map((photoIndex, dotIndex) => (
              <button
                key={`${currentPhotoIndex}-${dotIndex}`}
                className={`photo-dot ${dotIndex === 1 ? 'active' : ''}`}
                onClick={() => {
                  if (dotIndex === 0) {
                    // Previous dot clicked
                    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
                  } else if (dotIndex === 2) {
                    // Next dot clicked
                    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
                  }
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 3000)
                }}
                aria-label={dotIndex === 1 ? 'Current photo' : dotIndex === 0 ? 'Previous photo' : 'Next photo'}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* PA and Influencers Grid Container */}
      <div className="pa-influencers-grid">
      {/* PA Background Section */}
      <div 
        className="pa-background-section"
        style={{ backgroundImage: `url(${paBg})` }}
      >
        <div className="pa-content-wrapper">
          <div className="pa-text-content">
            <Link 
              to="/professional-athletes" 
              id="professional-athletes" 
              className="pa-category-link"
            >
              <h2 className="pa-category-title">PROFESSIONAL ATHLETES</h2>
              <p className="pa-category-description">Browse your favorite overseas professional's international jersey</p>
                <Link to="/professional-athletes" className="pa-shop-now-button">
                  SHOP NOW →
                </Link>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Influencers Background Section */}
      <div 
        className="influencers-background-section"
        style={{ backgroundImage: `url(${iBg})` }}
      >
        <div className="influencers-content-wrapper">
          <div className="influencers-text-content">
            <Link 
              to="/influencers" 
              id="influencers" 
              className="influencers-category-link"
            >
              <h2 className="influencers-category-title">INFLUENCERS</h2>
              <p className="influencers-category-description">Browse your favorite influencers' gear</p>
                <Link to="/influencers" className="influencers-shop-now-button">
                  SHOP NOW →
                </Link>
            </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* High School Athletes and Teamwear Grid Container */}
      <div className="ha-tw-grid">
      {/* High School Athletes Background Section */}
      <div 
        className="ha-background-section"
        style={{ backgroundImage: `url(${haBg})` }}
      >
        <div className="ha-content-wrapper">
          <div className="ha-text-content">
            <Link 
              to="/high-school-athletes" 
              id="high-school-athletes" 
              className="ha-category-link"
            >
              <h2 className="ha-category-title">HIGH SCHOOL ATHLETES</h2>
              <p className="ha-category-description">Browse your favorite High School star</p>
                <Link to="/high-school-athletes" className="ha-shop-now-button">
                  SHOP NOW →
                </Link>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Teamwear Background Section */}
      <div 
        className="tw-background-section"
        style={{ backgroundImage: `url(${twBg})` }}
      >
        <div className="tw-content-wrapper">
          <div className="tw-text-content">
            <Link 
              to="/teamwear" 
              id="teamwear" 
              className="tw-category-link"
            >
              <h2 className="tw-category-title">TEAMWEAR</h2>
              <p className="tw-category-description">Design custom uniforms for your squad and submit your teamwear request</p>
                <Link to="/teamwear" className="tw-shop-now-button">
                  START YOUR ORDER →
                </Link>
            </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Us Section - Full Width */}
      <div 
        id="about-us" 
        className="about-us-section"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="about-us-content">
          <h2 className="about-us-title">JerseyLab</h2>
          <div className="about-us-text">
            <p className="about-us-paragraph">
              At JerseyLab, we believe jerseys are more than fabric. They're living stories of the game. Every player, from professional athletes to high school stars and basketball influencers, carries a legacy that deserves to be celebrated.
            </p>
            <p className="about-us-paragraph">
              That's why we partner directly with players to design and release authentic jerseys. From the teams they've represented to the years they've shined, every jersey captures a chapter of basketball history.
            </p>
            <p className="about-us-paragraph">
              Our mission is to:
            </p>
            <ul className="about-us-mission-list">
              <li>Empower players by giving them ownership of their brand and story</li>
              <li>Connect fans with exclusive, collectible jerseys that honor real moments</li>
              <li>Celebrate the culture of basketball at every level — pro, local, and digital</li>
            </ul>
            <p className="about-us-paragraph">
              JerseyLab isn't just a store. It's a movement where fans, players, and communities come together to keep the spirit of the game alive.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage

