import React from 'react'
import './ShippingReturnsPage.css'

const ShippingReturnsPage = () => {
  return (
    <div className="shipping-returns-page">
      <h1 className="page-title">SHIPPING & RETURNS</h1>

      <div className="policy-content">
        <section className="policy-item">
          <h2 className="policy-item-title">Processing Time</h2>
          <p className="policy-item-value">3–5 business days</p>
          <p className="policy-item-note">For team orders, please account for additional processing/design review and approval time.</p>
        </section>

        <section className="policy-item">
          <h2 className="policy-item-title">Shipping Time</h2>
          <p className="policy-item-value">4–5 weeks (U.S. only)</p>
        </section>

        <section className="policy-item">
          <h2 className="policy-item-title">Returns</h2>
          <p className="policy-item-value">All sales are final.</p>
          <p className="policy-item-note">Only accepted if there's a manufacturing defect.</p>
        </section>

        <section className="policy-item">
          <h2 className="policy-item-title">Cancellations</h2>
          <p className="policy-item-value">Within 2 business days of purchase only.</p>
        </section>

        <section className="policy-item">
          <h2 className="policy-item-title">Contact</h2>
          <p className="policy-item-value">
            <a href="mailto:info@jerzeylab.com" className="contact-link">info@jerzeylab.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}

export default ShippingReturnsPage

