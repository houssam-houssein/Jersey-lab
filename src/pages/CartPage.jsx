import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPage.css'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    alert('Thank you for your order! A member of our team will contact you to complete the checkout process.')
    clearCart()
    navigate('/')
  }

  return (
    <div className="cart-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-cart-message">Your cart is empty</p>
            <Link to="/professional-athletes" className="continue-shopping-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-size">Size: {item.size}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${index}`}>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1
                          updateQuantity(item.id, item.size, newQuantity)
                        }}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p className="item-total-price">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeFromCart(item.id, item.size)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value">Calculated at checkout</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Total:</span>
                <span className="summary-value">${getCartTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage

