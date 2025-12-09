import React from 'react'
import { Link } from 'react-router-dom'
import './InfluencersPage.css'

const InfluencersPage = () => {

  return (
    <div className="influencers-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">Influencer Spotlight Shop</h1>
        <p className="page-subtitle">
          Cop the curated fits from the creators redefining hoops culture. Each drop is crafted in limited runs and ships with exclusive creator content.
        </p>
      </header>

      <section className="coming-soon-section" aria-label="Coming soon">
        <div className="coming-soon-content">
          <h2 className="coming-soon-title">Coming Soon</h2>
          <p className="coming-soon-message">
            We're curating amazing influencer collections for you. Check back soon for exclusive drops!
          </p>
        </div>
      </section>

      <section className="collab-section">
        <h3 className="collab-title">Creators - let's build together</h3>
        <p className="collab-copy">
          Pitch your concept, launch drop-ready merch, and tap into the Jerzey LAB production network.
        </p>
        <a className="collab-link" href="mailto:collabs@jerzeylab.com">
          collabs@jerzeylab.com
        </a>
      </section>
    </div>
  )
}

export default InfluencersPage


