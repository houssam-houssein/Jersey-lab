import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false })

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for guest checkout
  email: { type: String, required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  promoCode: { type: String },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentIntentId: { type: String, required: true }, // Stripe payment intent ID
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
  stripeCustomerId: { type: String },
  notes: { type: String }
}, { timestamps: true })

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    this.orderNumber = `JL-${timestamp}-${random}`
  }
  next()
})

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ email: 1, createdAt: -1 })
orderSchema.index({ paymentIntentId: 1 })
orderSchema.index({ orderNumber: 1 })

const Order = mongoose.model('Order', orderSchema)

export default Order

