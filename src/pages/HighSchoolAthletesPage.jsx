import React from 'react'
import { Link } from 'react-router-dom'
import './HighSchoolAthletesPage.css'

const HighSchoolAthletesPage = () => {

  return (
    <div className="high-school-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">High School Spotlight Shop</h1>
        <p className="page-subtitle">
          Support the future of the game. Rep limited merch from the country's rising stars, produced in partnership with their programs.
        </p>
      </header>

      <section className="coming-soon-section" aria-label="Coming soon">
        <div className="coming-soon-content">
          <h2 className="coming-soon-title">Coming Soon</h2>
          <p className="coming-soon-message">
            We're working on bringing you the best high school athlete merchandise. Stay tuned for exciting drops!
          </p>
        </div>
      </section>

      <section className="programs-section">
        <h3 className="programs-title">Coaches & ADs - let's feature your program</h3>
        <p className="programs-copy">
          Launch team stores, fundraise with specialty merch, and unlock pro-grade production with Jerzey LAB.
        </p>
        <a className="programs-link" href="mailto:teams@jerzeylab.com">
          teams@jerzeylab.com
        </a>
      </section>
    </div>
  )
}

export default HighSchoolAthletesPage


