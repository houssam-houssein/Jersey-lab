import React from 'react'
import './TermsConditionsPage.css'

const TermsConditionsPage = () => {
  return (
    <div className="terms-conditions-page">
      <h1 className="page-title">TERMS & CONDITIONS</h1>

      <div className="terms-content">
        <p className="intro-paragraph">
          Welcome to JerzeyLab LLC. By accessing, browsing, or making a purchase through our website, you agree to be bound by the following Terms and Conditions ("Terms') . Please review them carefully prior to placing an order. If you do not agree to these Terms, you may not use our website or services.
        </p>

        <section className="terms-section">
          <h2 className="section-title">1. Eligibility and General Use </h2>
          <p className="terms-paragraph">
            By using this website, you represent and warrant that you are at least eighteen (18) years of age or that you are accessing the website with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms. 
          </p>
          <p className="terms-paragraph">
            We reserve the right, at our sole discretion, to modify, update, or replace these Terms at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the revised Terms.
          </p>
          <p className="terms-paragraph">
            All product descriptions, images, and content are provided for informational purposes only and do not constitute warranties or guarantees, except as expressly stated herein.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">2. Products</h2>
          <p className="terms-paragraph">
            JerzeyLab LLC. offers custom merchandise. While we make commercially reasonable efforts to accurately display and describe all products, slight variations in color, design, or appearance may occur due to display settings, production processes, or manufacturing tolerances. Such variations do not constitute defects.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">3. Prices and Payments</h2>
          <p className="terms-paragraph">
            All prices are listed in U.S. Dollars (USD) unless otherwise stated. We accept major credit and debit cards, as well as other secure payment methods made available at checkout.
          </p>
          <p className="terms-paragraph">
            Prices, product availability, and promotions are subject to change at any time without notice. JerzeyLab LLC. reserves the right to correct pricing errors or inaccuracies, including after an order has been placed.
          </p>
          <p className="terms-paragraph">
            Payment processing fees associated with the use of credit cards, debit cards, or other electronic payment methods may be assessed at checkout and are the responsibility of the customer. Any such fees will be disclosed prior to order confirmation.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">4. Order Processing and Shipping</h2>
          <p className="terms-paragraph">
            Orders are typically processed within three (3) to five (5) business days following payment confirmation.
          </p>
          <p className="terms-paragraph">
            Estimated delivery time within the United States is approximately four (4) to five (5) weeks from payment confirmation. Delivery timelines are estimates only and are not guaranteed.
          </p>
          <p className="terms-paragraph">
            Shipping delays may occur due to factors beyond our control, including but not limited to carrier delays, customs processing, holidays, or incorrect or incomplete shipping information provided by the customer.
          </p>
          <p className="terms-paragraph">
            Once an order has shipped, a tracking number will be provided via email. JerzeyLab LLC. is not responsible for lost, delayed, or misdelivered shipments once they are in the possession of the carrier.
          </p>

        </section>

        <section className="terms-section">
          <h2 className="section-title">5. Returns and Exchanges</h2>
          <p className="terms-paragraph">
            All sales are final. We do not accept returns, exchanges, or refunds once an order has been placed, except in the limited circumstances outlined below:
          </p>
          
          <ul className="terms-list">
            <li>The item received has a manufacturing defect; or</li>
            <li>The item received is materially different from what was ordered due to our error.</li>
          </ul>
          <p className="terms-paragraph">
            To be eligible for review, you must contact us within seven (7) days of delivery at info@jerzeylab.com, providing your order number, clear photographs of the issue, and a written description of the problem. JerzeyLab LLC. reserves the right to determine, in its sole discretion, whether a replacement or refund is warranted.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">6. Cancellations</h2>
          <p className="terms-paragraph">
            Orders may be canceled within two (2) business days of purchase. After this period, cancellation is not guaranteed, as orders may have entered processing or production.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">7. Intellectual Property</h2>
          <p className="terms-paragraph">
            All content on this website, including but not limited to designs, logos, graphics, product images, text, and layout, is the exclusive property of JerzeyLab LLC. and is protected under applicable copyright, trademark, and intellectual property laws. Any unauthorized use, reproduction, or distribution is strictly prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">8. Limitation of Liability</h2>
          <p className="terms-paragraph">
            To the maximum extent permitted by law, JerzeyLab LLC. shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of or relating to the use of, or inability to use, this website or any products purchased through it, even if advised of the possibility of such damages.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">9. Governing Law</h2>
          <p className="terms-paragraph">
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict-of-law principles. Any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the state or federal courts located within the State of California.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">10. Contact Us</h2>
          <p className="terms-paragraph">
            For any questions or concerns, please contact us at:
          </p>
          <ul className="contact-list">
            <li>📧 <a href="mailto:info@jerzeylab.com" className="contact-link">info@jerzeylab.com</a></li>
            <li>🌐 <a href="/" className="contact-link">jerzeylab.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default TermsConditionsPage

