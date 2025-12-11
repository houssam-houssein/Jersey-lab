import mongoose from 'mongoose'

const promoCodesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null // Only for percentage discounts
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
promoCodesSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Method to check if promo code is valid
promoCodesSchema.methods.isValid = function() {
  const now = new Date()
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  )
}

// Method to calculate discount
promoCodesSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid() || subtotal < this.minPurchaseAmount) {
    return 0
  }

  let discount = 0
  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount
    }
  } else {
    discount = this.discountValue
    if (discount > subtotal) {
      discount = subtotal
    }
  }

  return Math.round(discount * 100) / 100 // Round to 2 decimal places
}

const PromoCode = mongoose.model('PromoCode', promoCodesSchema)

export default PromoCode

