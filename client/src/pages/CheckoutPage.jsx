import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './CheckoutPage.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_key_replace_with_real_key')

const CheckoutForm = ({ cartItems, subtotal, discount, promoCode, shipping, tax, total, onOrderSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clearCart } = useCart()
  
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payments/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Credentials': 'include'
          },
          credentials: 'include',
          body: JSON.stringify({
            items: cartItems,
            shippingAddress,
            subtotal,
            discount,
            promoCode,
            shipping,
            tax,
            total,
            userId: user?.id || null,
            email: shippingAddress.email
          })
        })

        const data = await response.json()
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
          setPaymentIntentId(data.paymentIntentId)
        } else {
          setError(data.error || 'Failed to initialize payment')
        }
      } catch (err) {
        console.error('Error creating payment intent:', err)
        setError('Failed to initialize payment. Please try again.')
      }
    }

    if (cartItems.length > 0 && shippingAddress.email) {
      createPaymentIntent()
    }
  }, [cartItems, subtotal, discount, promoCode, shipping, tax, total, user, shippingAddress.email])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Please fill in all required shipping address fields')
      return
    }

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: shippingAddress.country
            }
          }
        }
      })

      if (paymentError) {
        setError(paymentError.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Create order
        const orderResponse = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Credentials': 'include'
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            items: cartItems,
            shippingAddress,
            subtotal,
            discount,
            promoCode,
            shipping,
            tax,
            total,
            userId: user?.id || null,
            email: shippingAddress.email
          })
        })

        const orderData = await orderResponse.json()

        if (orderData.order) {
          clearCart()
          onOrderSuccess(orderData.order)
        } else {
          setError('Payment succeeded but failed to create order. Please contact support.')
        }
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('An error occurred during payment. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-section">
        <h2 className="section-title">Shipping Address</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              value={shippingAddress.name}
              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={shippingAddress.email}
              onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="checkout-section">
        <h2 className="section-title">Payment Information</h2>
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="submit-payment-button"
        disabled={!stripe || processing || !clientSecret}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  )
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [order, setOrder] = useState(null)
  
  // Get cart data from location state or calculate from cart
  const cartData = location.state || {
    subtotal: getCartTotal(),
    discount: 0,
    promoCode: null,
    shipping: 0,
    tax: 0
  }

  const subtotal = cartData.subtotal || getCartTotal()
  const discount = cartData.discount || 0
  const promoCode = cartData.promoCode || null
  const shipping = cartData.shipping || 0
  const tax = cartData.tax || 0
  const total = subtotal - discount + shipping + tax

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart')
    }
  }, [cartItems, orderSuccess, navigate])

  const handleOrderSuccess = (orderData) => {
    setOrder(orderData)
    setOrderSuccess(true)
  }

  if (orderSuccess && order) {
    return (
      <div className="checkout-page">
        <div className="order-success-container">
          <div className="order-success">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-message">Thank you for your purchase.</p>
            <p className="order-number">Order Number: {order.orderNumber}</p>
            <button className="continue-shopping-button" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => navigate('/cart')}>
        ← Back to Cart
      </button>

      <div className="checkout-container">
        <div className="checkout-main">
          <h1 className="checkout-title">Checkout</h1>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              promoCode={promoCode}
              shipping={shipping}
              tax={tax}
              total={total}
              onOrderSuccess={handleOrderSuccess}
            />
          </Elements>
        </div>

        <div className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${index}`} className="summary-item">
                <img src={item.image} alt={item.name} className="summary-item-image" />
                <div className="summary-item-details">
                  <p className="summary-item-name">{item.name}</p>
                  <p className="summary-item-size">Size: {item.size}</p>
                  <p className="summary-item-quantity">Qty: {item.quantity}</p>
                </div>
                <p className="summary-item-price">
                  ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount ({promoCode}):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

