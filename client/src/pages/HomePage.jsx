import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import logo from '../assets/images/logo.png'
import bgPoster from '../assets/images/bg-poster.png'
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
  // Create infinite loop with 3 sets of photos for seamless scrolling
  const infinitePhotos = [...photos, ...photos, ...photos]
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(photos.length) // Start in the middle set
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968)
  const carouselRef = useRef(null)
  const [photoStep, setPhotoStep] = useState(0)
  const [mobilePhotoWidth, setMobilePhotoWidth] = useState(0)

  useEffect(() => {
    const calculatePhotoStep = () => {
      if (!carouselRef.current) {
        setPhotoStep(0)
        setMobilePhotoWidth(0)
        return
      }
      
      const carousel = carouselRef.current
      const carouselWidth = carousel.offsetWidth
      
      if (window.innerWidth <= 968) {
        // Mobile: photo width = container width (100%)
        setMobilePhotoWidth(carouselWidth)
        setPhotoStep(0)
      } else {
        // Desktop: Carousel has 10px gap between photos
        // Photo width = (carouselWidth - 20px) / 3 (20px = 2 gaps of 10px each)
        // Step = photo width + gap = (carouselWidth - 20px) / 3 + 10px
        const step = (carouselWidth - 20) / 3 + 10
        setPhotoStep(step)
        setMobilePhotoWidth(0)
      }
    }
    
    const handleResize = () => {
      const wasMobile = isMobile
      setIsMobile(window.innerWidth <= 968)
      calculatePhotoStep()
    }
    
    window.addEventListener('resize', handleResize)
    calculatePhotoStep() // Initial calculation
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

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
      setIsAnimating(true)
      setCurrentPhotoIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        // If we're about to leave the middle set, jump back to equivalent position in middle set
        if (nextIndex >= photos.length * 2) {
          setTimeout(() => {
            setIsAnimating(false)
            setCurrentPhotoIndex(nextIndex - photos.length)
          }, 600)
          return nextIndex
        }
        setTimeout(() => setIsAnimating(false), 600)
        return nextIndex
      })
    }, 3000) // Change photo every 3 seconds

    return () => clearInterval(interval)
  }, [photos.length, isPaused])

  // Swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
    setSwipeOffset(0)
    setIsAnimating(false)
  }

  const onTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX
    setTouchEnd(currentX)
    if (touchStart !== null) {
      const offset = currentX - touchStart
      setSwipeOffset(offset)
      setIsAnimating(false)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0)
      setIsPaused(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setIsAnimating(true)
      setCurrentPhotoIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        // If we're about to leave the middle set, jump back to equivalent position in middle set
        if (nextIndex >= photos.length * 2) {
          setTimeout(() => {
            setIsAnimating(false)
            setCurrentPhotoIndex(nextIndex - photos.length)
          }, 600)
          return nextIndex
        }
        setTimeout(() => setIsAnimating(false), 600)
        return nextIndex
      })
    } else if (isRightSwipe) {
      setIsAnimating(true)
      setCurrentPhotoIndex((prevIndex) => {
        const prevIndexValue = prevIndex - 1
        // If we're about to leave the middle set, jump back to equivalent position in middle set
        if (prevIndexValue < photos.length) {
          setTimeout(() => {
            setIsAnimating(false)
            setCurrentPhotoIndex(prevIndexValue + photos.length)
          }, 600)
          return prevIndexValue
        }
        setTimeout(() => setIsAnimating(false), 600)
        return prevIndexValue
      })
    } else {
      setSwipeOffset(0)
      setIsPaused(false)
      return
    }
    
    setSwipeOffset(0)
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
    setSwipeOffset(0)
    setIsAnimating(false)
  }

  const onMouseMove = (e) => {
    if (isDragging && mouseStart !== null) {
      const currentX = e.clientX
      setMouseEnd(currentX)
      const offset = currentX - mouseStart
      setSwipeOffset(offset)
      setIsAnimating(false)
    }
  }

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd || !isDragging) {
      setIsDragging(false)
      setIsPaused(false)
      setSwipeOffset(0)
      return
    }
    
    const distance = mouseStart - mouseEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setIsAnimating(true)
      setCurrentPhotoIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        // If we're about to leave the middle set, jump back to equivalent position in middle set
        if (nextIndex >= photos.length * 2) {
          setTimeout(() => {
            setIsAnimating(false)
            setCurrentPhotoIndex(nextIndex - photos.length)
          }, 600)
          return nextIndex
        }
        setTimeout(() => setIsAnimating(false), 600)
        return nextIndex
      })
    } else if (isRightSwipe) {
      setIsAnimating(true)
      setCurrentPhotoIndex((prevIndex) => {
        const prevIndexValue = prevIndex - 1
        // If we're about to leave the middle set, jump back to equivalent position in middle set
        if (prevIndexValue < photos.length) {
          setTimeout(() => {
            setIsAnimating(false)
            setCurrentPhotoIndex(prevIndexValue + photos.length)
          }, 600)
          return prevIndexValue
        }
        setTimeout(() => setIsAnimating(false), 600)
        return prevIndexValue
      })
    } else {
      setIsDragging(false)
      setMouseStart(null)
      setMouseEnd(null)
      setSwipeOffset(0)
      setIsPaused(false)
      return
    }
    
    setIsDragging(false)
    setMouseStart(null)
    setMouseEnd(null)
    setSwipeOffset(0)
    // Resume auto-rotation after a delay
    setTimeout(() => setIsPaused(false), 3000)
  }


  return (
    <div className="homepage">
      <div className="homepage-content">
        {/* Main Poster */}
        <div className="main-logo">
          <img src={bgPoster} alt="JerzeyLab Background" className="main-poster-bg" />
          <img src={logo} alt="JerzeyLab Logo" className="main-poster-logo" />
        </div>
      </div>
      
      {/* Rotating Photos Section */}
      <div className="rotating-photos-section">
        <div className="rotating-photos-container">
        <div 
            ref={carouselRef}
            className="rotating-photos-carousel"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: isMobile 
                ? mobilePhotoWidth > 0
                  ? `translateX(calc(-${currentPhotoIndex * mobilePhotoWidth}px + ${swipeOffset}px))`
                  : `translateX(calc(-${currentPhotoIndex * 100}% + ${swipeOffset}px))`
                : photoStep > 0
                  ? `translateX(calc(-${currentPhotoIndex * photoStep}px + ${swipeOffset}px))`
                  : `translateX(calc(-${currentPhotoIndex * 33.333}% + ${swipeOffset}px))`,
              transition: isAnimating && swipeOffset === 0 ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
        >
            {infinitePhotos.map((photo, index) => (
            <img
              key={index}
              src={photo}
                alt={`JerzeyLab Gallery ${(index % photos.length) + 1}`}
                className="rotating-photo"
              draggable={false}
            />
          ))}
          </div>
          
          {/* Navigation Dots - Only 3 dots in a line, rotates with photos */}
          <div className="photo-navigation-dots">
            {[
              currentPhotoIndex - 1, // Previous
              currentPhotoIndex, // Current
              currentPhotoIndex + 1 // Next
            ].map((photoIndex, dotIndex) => {
              // Map infinite index to real photo index (0-12)
              const realIndex = ((photoIndex % photos.length) + photos.length) % photos.length
              return (
              <button
                key={`${currentPhotoIndex}-${dotIndex}`}
                className={`photo-dot ${dotIndex === 1 ? 'active' : ''}`}
                onClick={() => {
                    setIsAnimating(true)
                  if (dotIndex === 0) {
                    // Previous dot clicked
                      setCurrentPhotoIndex((prevIndex) => {
                        const prevIndexValue = prevIndex - 1
                        if (prevIndexValue < photos.length) {
                          setTimeout(() => {
                            setIsAnimating(false)
                            setCurrentPhotoIndex(prevIndexValue + photos.length)
                          }, 600)
                          return prevIndexValue
                        }
                        setTimeout(() => setIsAnimating(false), 600)
                        return prevIndexValue
                      })
                  } else if (dotIndex === 2) {
                    // Next dot clicked
                      setCurrentPhotoIndex((prevIndex) => {
                        const nextIndex = prevIndex + 1
                        if (nextIndex >= photos.length * 2) {
                          setTimeout(() => {
                            setIsAnimating(false)
                            setCurrentPhotoIndex(nextIndex - photos.length)
                          }, 600)
                          return nextIndex
                        }
                        setTimeout(() => setIsAnimating(false), 600)
                        return nextIndex
                      })
                  }
                  setIsPaused(true)
                    setTimeout(() => setIsAnimating(false), 600)
                  setTimeout(() => setIsPaused(false), 3000)
                }}
                aria-label={dotIndex === 1 ? 'Current photo' : dotIndex === 0 ? 'Previous photo' : 'Next photo'}
              />
              )
            })}
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
              <p className="pa-category-description">Browse your favorite overseas professional's international jerzey</p>
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
          <h2 className="about-us-title">JerzeyLab</h2>
          <div className="about-us-text">
            <p className="about-us-paragraph">
              At JerzeyLab, jerseys are more than fabric — they're living stories of the game. Every player, from professional athletes to high school standouts and basketball creators, carries a legacy worth celebrating.
            </p>
            <p className="about-us-paragraph">
              That's why we partner directly with players to design and release authentic, story-driven jerseys. From the teams they represent to the years they've shined, every piece captures a real chapter of their basketball history.
            </p>
            <p className="about-us-paragraph">
              Our mission is to:
            </p>
            <ul className="about-us-mission-list">
              <li>Empower players by giving them ownership of their brand and story</li>
              <li>Connect fans with exclusive, collectible jerseys tied to real moments</li>
              <li>Celebrate basketball culture at every level — from the biggest stages to the next wave</li>
            </ul>
            <p className="about-us-paragraph">
              JerzeyLab isn't just a store. It's a movement — bringing players, fans, and communities together to preserve the spirit, history, and future of the game.
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

