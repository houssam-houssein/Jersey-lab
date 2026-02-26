import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'
import Category from './models/Category.js'
import TeamwearInquiry from './models/TeamwearInquiry.js'
import User from './models/User.js'
import PromoCode from './models/PromoCode.js'
import Order from './models/Order.js'
import { 
  sendWelcomeEmail, 
  sendNewUserSignupNotificationToOwner,
  sendTeamwearInquiryNotification, 
  sendOrderNotificationToAdmins,
  sendAdminPasswordResetEmail,
  getAllAdminEmails,
  verifyEmailConfig 
} from './utils/emailService.js'
import Stripe from 'stripe'
import crypto from 'crypto'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_replace_with_real_key', {
  apiVersion: '2024-12-18.acacia'
})
// Default to local MongoDB for development
// To use MongoDB Atlas, set MONGODB_URI in .env file with your Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jerseylab'
const isLocalMongoDB = !MONGODB_URI.includes('mongodb.net') && !MONGODB_URI.includes('mongodb+srv')

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]
const envOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || ''
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins.split(',').map(origin => origin.trim()).filter(Boolean)])]

// CORS configuration - allow credentials and multiple origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    console.warn(`Blocked request from disallowed origin: ${origin}`)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Mongo connection - optimized for local or Atlas based on connection string
const connectionOptions = isLocalMongoDB
  ? {
      // Local MongoDB options (simpler, faster for dev)
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 2000
    }
  : {
      // MongoDB Atlas options (optimized for cloud)
  retryWrites: true,
  w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000
    }

mongoose.connect(MONGODB_URI, connectionOptions).then(() => {
  console.log(`âœ… Connected to ${isLocalMongoDB ? 'Local MongoDB' : 'MongoDB Atlas'}`)
  if (isLocalMongoDB) {
    console.log('ðŸ“ Database: Jerseylab (localhost:27017)')
  }
}).catch((error) => {
  console.error('âŒ MongoDB connection error:', error.message)
  if (isLocalMongoDB) {
    console.error('ðŸ’¡ Make sure MongoDB is running locally: mongod')
  } else {
    console.error('ðŸ’¡ Check your MongoDB Atlas connection string and IP whitelist')
  }
  process.exit(1)
})

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Passport Google OAuth Strategy (optional)
const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

if (hasGoogleKeys) {
  // Ensure callback URL is valid (fix if env value was set as "GOOGLE_CALLBACK_URL=https://...")
  let callbackURL = (process.env.GOOGLE_CALLBACK_URL || '').trim()
  if (callbackURL.includes('GOOGLE_CALLBACK_URL=')) {
    callbackURL = (callbackURL.split('GOOGLE_CALLBACK_URL=')[1] || '').split(/\s/)[0].trim()
  }
  if (!callbackURL || (!callbackURL.startsWith('http://') && !callbackURL.startsWith('https://'))) {
    callbackURL = process.env.NODE_ENV === 'production'
      ? 'https://jerzey-lab-api.onrender.com/api/auth/google/callback'
      : 'http://localhost:5000/api/auth/google/callback'
  }
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL,
    passReqToCallback: true // Allow access to request object
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value
      const googleId = profile.id
      const name = profile.displayName
      const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null
      const isSignupFlow = req.session?.isSignupFlow || false

      // Check if user exists in database
      let user = await User.findOne({ 
        $or: [
          { googleId: googleId },
          { email: email }
        ]
      })

      // If this is a signup flow and user already exists, prevent duplicate signup
      if (isSignupFlow && user && user.hasSignedUp) {
        const error = new Error('Account already exists')
        error.code = 'ACCOUNT_EXISTS'
        return done(error, null)
      }
      
      if (user) {
        // If user exists but hasn't signed up, complete signup
        if (!user.hasSignedUp) {
          user.hasSignedUp = true
          user.googleId = googleId
          user.name = name
          user.picture = picture
          user.isVerified = true
          user.lastLogin = new Date()
          user.loginCount = 1
          await user.save()
          
          // Send welcome email to new user and notify owner
          sendWelcomeEmail(user.email, user.name).catch(err => 
            console.error('Failed to send welcome email:', err)
          )
          sendNewUserSignupNotificationToOwner(user.email, user.name).catch(err => 
            console.error('Failed to send new user notification to owner:', err)
          )
        } else {
          // User exists and has signed up - regular login
          user.googleId = googleId
          user.name = name
          user.picture = picture
          user.lastLogin = new Date()
          user.loginCount = (user.loginCount || 0) + 1
          user.isVerified = true
          await user.save()
        }
      } else {
        // User doesn't exist - create new user (signup)
        user = await User.create({
          googleId: googleId,
          email: email,
          name: name,
          picture: picture,
          provider: 'google',
          hasSignedUp: true,
          isVerified: true,
          lastLogin: new Date(),
          loginCount: 1
        })
        
        // Send welcome email to new user and notify owner
        sendWelcomeEmail(user.email, user.name).catch(err => 
          console.error('Failed to send welcome email:', err)
        )
        sendNewUserSignupNotificationToOwner(user.email, user.name).catch(err => 
          console.error('Failed to send new user notification to owner:', err)
        )
      }

      // Return user object for session (without mongoose document methods)
      const userObj = {
        id: user._id.toString(),
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider,
        hasSignedUp: user.hasSignedUp,
        isVerified: user.isVerified
      }

      return done(null, userObj)
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error)
      return done(error, null)
    }
  }))
} else {
  console.warn('âš ï¸  Google OAuth environment variables missing. Skipping Google strategy setup.')
}

// Serialize user for session (store user ID)
passport.serializeUser((user, done) => {
  done(null, user.id) // Store user ID in session
})

// Deserialize user from session (fetch from database)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    if (user) {
      const userObj = {
        id: user._id.toString(),
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider
      }
      done(null, userObj)
    } else {
      done(null, null)
    }
  } catch (error) {
    console.error('Error deserializing user:', error)
    done(error, null)
  }
})

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'JerseyLab API',
    status: 'running',
    health: '/api/health',
    docs: 'Use the API endpoints under /api/'
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Admin authentication routes (local)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.json({
      token: 'placeholder-token',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Request password reset
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    
    // Always return success to prevent email enumeration
    if (!admin) {
      return res.json({ 
        message: 'If an admin account exists with this email, a password reset link has been sent.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour from now

    admin.resetPasswordToken = resetToken
    admin.resetPasswordExpires = resetExpires
    await admin.save()

    // Send reset email
    try {
      await sendAdminPasswordResetEmail(admin.email, resetToken)
      console.log(`Password reset email sent to admin: ${admin.email}`)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails
    }

    res.json({ 
      message: 'If an admin account exists with this email, a password reset link has been sent.' 
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Reset password with token
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!admin) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Set new password (will be hashed by pre-save hook)
    admin.password = newPassword
    admin.resetPasswordToken = undefined
    admin.resetPasswordExpires = undefined
    await admin.save()

    res.json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Simple in-memory cache for categories (5 minute TTL)
const categoryCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCachedCategory = (key) => {
  const cached = categoryCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

const setCachedCategory = (key, data) => {
  categoryCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'all_categories'
    const cached = getCachedCategory(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    // Only fetch essential fields to reduce payload size
    const categories = await Category.find()
      .select('key title description heroImage status products')
      .sort({ createdAt: 1 })
      .lean() // Use lean() for faster queries (returns plain JS objects)
    
    // Cache the result
    setCachedCategory(cacheKey, categories)
    
    res.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get single category by key (optimized endpoint with caching)
app.get('/api/categories/key/:key', async (req, res) => {
  try {
    const { key } = req.params
    
    // Check cache first
    const cached = getCachedCategory(key)
    if (cached) {
      return res.json(cached)
    }
    
    const category = await Category.findOne({ key: key })
      .select('key title description heroImage status products')
      .lean()
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    // Cache the result
    setCachedCategory(key, category)
    
    res.json(category)
  } catch (error) {
    console.error('Failed to fetch category:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { products, ...categoryData } = req.body
    
    // Update category fields and products array
    const updated = await Category.findByIdAndUpdate(
      id,
      {
        ...categoryData,
        products: products || []
      },
      { new: true, runValidators: true }
    )
    
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    // Clear cache when category is updated
    categoryCache.clear()
    
    res.json(updated)
  } catch (error) {
    console.error('Failed to update category:', error)
    res.status(500).json({ error: 'Failed to update category', details: error.message })
  }
})

// Teamwear Inquiry endpoints
app.post('/api/teamwear-inquiries', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, description, designFiles, designFile, fileName } = req.body
    
    // Support both new format (designFiles array) and legacy format (single designFile)
    let inquiryData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      description,
      status: 'pending'
    }
    
    if (designFiles && Array.isArray(designFiles) && designFiles.length > 0) {
      // New format: multiple files
      inquiryData.designFiles = designFiles.slice(0, 5) // Limit to 5 files
    } else if (designFile) {
      // Legacy format: single file (for backward compatibility)
      inquiryData.designFile = designFile
      inquiryData.fileName = fileName || ''
    }
    
    const inquiry = await TeamwearInquiry.create(inquiryData)
    
    // Send email notification to all admins
    try {
      const adminEmails = await getAllAdminEmails(Admin)
      if (adminEmails.length > 0) {
        // Send to all admins
        for (const adminEmail of adminEmails) {
          await sendTeamwearInquiryNotification(adminEmail, inquiry)
        }
        console.log(`Teamwear inquiry notification sent to ${adminEmails.length} admin(s)`)
      } else {
        console.warn('No admin emails found for teamwear inquiry notification')
      }
    } catch (emailError) {
      console.error('Failed to send teamwear inquiry notification email:', emailError)
      // Don't fail the request if email fails
    }
    
    res.status(201).json(inquiry)
  } catch (error) {
    console.error('Failed to create teamwear inquiry:', error)
    res.status(500).json({ error: 'Failed to submit inquiry', details: error.message })
  }
})

app.get('/api/teamwear-inquiries', async (req, res) => {
  try {
    const inquiries = await TeamwearInquiry.find().sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    console.error('Failed to fetch teamwear inquiries:', error)
    res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message })
  }
})

app.put('/api/teamwear-inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updated = await TeamwearInquiry.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Failed to update teamwear inquiry:', error)
    res.status(500).json({ error: 'Failed to update inquiry', details: error.message })
  }
})

// Signup endpoint - creates user account
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      if (existingUser.hasSignedUp) {
        return res.status(400).json({ error: 'User already exists. Please log in instead.' })
      } else {
        // User exists but hasn't signed up - update them
        existingUser.name = name
        if (password) {
          existingUser.password = password // Will be hashed by pre-save hook
        }
        existingUser.hasSignedUp = true
        existingUser.provider = password ? 'local' : 'google'
        await existingUser.save()
        
        // Send welcome email to user and notify owner
        sendWelcomeEmail(existingUser.email, existingUser.name).catch(err => 
          console.error('Failed to send welcome email:', err)
        )
        sendNewUserSignupNotificationToOwner(existingUser.email, existingUser.name).catch(err => 
          console.error('Failed to send new user notification to owner:', err)
        )
        
        return res.json({ 
          message: 'Signup successful. You can now log in.',
          user: {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            hasSignedUp: existingUser.hasSignedUp
          }
        })
      }
    }

    // Create new user
    const userData = {
      email: email.toLowerCase(),
      name: name,
      hasSignedUp: true,
      isVerified: false,
      provider: password ? 'local' : 'google' // Set provider based on whether password is provided
    }
    
    if (password) {
      userData.password = password // Will be hashed by pre-save hook
    }

    const user = await User.create(userData)

    // Send welcome email to user and notify owner
    sendWelcomeEmail(user.email, user.name).catch(err => 
      console.error('Failed to send welcome email:', err)
    )
    sendNewUserSignupNotificationToOwner(user.email, user.name).catch(err => 
      console.error('Failed to send new user notification to owner:', err)
    )

    res.json({ 
      message: password ? 'Signup successful! You can now log in.' : 'Signup successful. You can now log in with Google.',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        hasSignedUp: user.hasSignedUp
      }
    })
  } catch (error) {
    console.error('Error in signup:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user', details: error.message })
  }
})

// Login endpoint - email/password authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if user has signed up
    if (!user.hasSignedUp) {
      return res.status(401).json({ error: 'Please complete signup first' })
    }

    // Check if user has a password (local provider)
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google login. Please log in with Google instead.' })
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    user.lastLogin = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    await user.save()

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.error('Session creation error:', err)
        return res.status(500).json({ error: 'Failed to create session' })
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          picture: user.picture,
          provider: user.provider
        }
      })
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error', details: error.message })
  }
})

// Google OAuth Routes (only if keys provided)
if (hasGoogleKeys) {
  app.get('/api/auth/google',
    (req, res, next) => {
      console.log('Google OAuth initiated', { signup: req.query.signup, sessionId: req.sessionID })
      // Store signup intent in session if coming from signup page
      if (req.query.signup === 'true') {
        req.session.isSignupFlow = true
        console.log('Signup flow flag set in session')
      }
      // Force redirect to Google OAuth page
      // passport.authenticate automatically redirects to Google
      // We need to ensure it always redirects, even if user is already authenticated
      passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // Force account selection screen
      })(req, res, next)
    }
  )

  app.get('/api/auth/google/callback',
    (req, res, next) => {
      const isSignupFlow = req.session?.isSignupFlow || false
      passport.authenticate('google', (err, user, info) => {
        if (err) {
          console.error('OAuth error:', err.message)
          // Clear signup flag on error
          if (req.session) {
            req.session.isSignupFlow = false
          }
          
          // Check if error is due to account already existing
          if (err.code === 'ACCOUNT_EXISTS') {
            return res.redirect(process.env.CLIENT_URL + '/signup?error=account_exists')
          }
          
          return res.redirect(process.env.CLIENT_URL + '/login?error=auth_failed')
        }
        if (!user) {
          return res.redirect(process.env.CLIENT_URL + '/login?error=no_user')
        }
        req.login(user, (loginErr) => {
          if (loginErr) {
            return res.redirect(process.env.CLIENT_URL + '/login?error=session_failed')
          }
          // Clear signup flag after successful login
          if (req.session) {
            req.session.isSignupFlow = false
          }
          // If this was a signup flow, redirect to signup page with success message
          if (isSignupFlow) {
            return res.redirect(process.env.CLIENT_URL + '/signup?signup=success')
          }
          // Otherwise, regular login - redirect to homepage
          return res.redirect(process.env.CLIENT_URL + '/?login=success')
        })
      })(req, res, next)
    }
  )
}

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, authenticated: true })
  } else {
    res.json({ user: null, authenticated: false })
  }
})

// Admin: Get all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .lean()
    res.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Admin: Admin Management
// Get all admins
app.get('/api/admin/admins', async (req, res) => {
  try {
    console.log('Fetching admins from database...')
    const admins = await Admin.find()
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .lean()
    
    // Ensure _id is converted to string for JSON serialization
    const formattedAdmins = admins.map(admin => ({
      ...admin,
      _id: admin._id.toString()
    }))
    
    console.log(`Found ${formattedAdmins.length} admin(s)`)
    res.json(formattedAdmins)
  } catch (error) {
    console.error('Failed to fetch admins:', error)
    res.status(500).json({ error: 'Failed to fetch admins', details: error.message })
  }
})

// Create new admin
app.post('/api/admin/admins', async (req, res) => {
  try {
    const { email, password, name, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Validate role if provided
    const validRoles = ['owner', 'admin', 'manager', 'staff']
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be one of: owner, admin, manager, staff' })
    }

    // Check if admin already exists
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists with that email' })
    }

    // Create new admin (password will be hashed by the pre-save hook)
    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password,
      name: name || 'JerseyLab Owner',
      role: role || 'owner'
    })

    // Return admin without password
    const adminResponse = admin.toObject()
    delete adminResponse.password
    res.status(201).json(adminResponse)
  } catch (error) {
    console.error('Failed to create admin:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Admin already exists with that email' })
    }
    res.status(500).json({ error: 'Failed to create admin', details: error.message })
  }
})

// Delete admin
app.delete('/api/admin/admins/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedAdmin = await Admin.findByIdAndDelete(id)
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' })
    }
    res.status(204).send() // No content
  } catch (error) {
    console.error('Failed to delete admin:', error)
    res.status(500).json({ error: 'Failed to delete admin', details: error.message })
  }
})

// Admin: Promo Code Management
// Get all promo codes
app.get('/api/admin/promo-codes', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 })
    res.json(promoCodes)
  } catch (error) {
    console.error('Failed to fetch promo codes:', error)
    res.status(500).json({ error: 'Failed to fetch promo codes' })
  }
})

// Create new promo code
app.post('/api/admin/promo-codes', async (req, res) => {
  try {
    const promoCode = await PromoCode.create(req.body)
    res.status(201).json(promoCode)
  } catch (error) {
    console.error('Failed to create promo code:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Promo code already exists' })
    }
    res.status(500).json({ error: 'Failed to create promo code', details: error.message })
  }
})

// Update promo code
app.put('/api/admin/promo-codes/:id', async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' })
    }
    res.json(promoCode)
  } catch (error) {
    console.error('Failed to update promo code:', error)
    res.status(500).json({ error: 'Failed to update promo code', details: error.message })
  }
})

// Delete promo code
app.delete('/api/admin/promo-codes/:id', async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id)
    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' })
    }
    res.json({ message: 'Promo code deleted successfully' })
  } catch (error) {
    console.error('Failed to delete promo code:', error)
    res.status(500).json({ error: 'Failed to delete promo code' })
  }
})

// Public: Validate promo code
app.post('/api/promo-codes/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() })
    
    if (!promoCode) {
      return res.json({ valid: false, error: 'Promo code not found' })
    }
    
    if (!promoCode.isValid()) {
      return res.json({ valid: false, error: 'Promo code is not active or has expired' })
    }
    
    if (subtotal < promoCode.minPurchaseAmount) {
      return res.json({ 
        valid: false, 
        error: `Minimum purchase amount of $${promoCode.minPurchaseAmount} required` 
      })
    }
    
    const discount = promoCode.calculateDiscount(subtotal)
    
    res.json({
      valid: true,
      discount,
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue
      }
    })
  } catch (error) {
    console.error('Failed to validate promo code:', error)
    res.status(500).json({ error: 'Failed to validate promo code' })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

//  PAYMENT ENDPOINTS 

// Create Payment Intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, discount, promoCode, shipping, tax, total, userId, email } = req.body

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' })
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' })
    }
    if (total <= 0) {
      return res.status(400).json({ error: 'Total must be greater than 0' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId || 'guest',
        email: email,
        itemCount: items.length.toString(),
        promoCode: promoCode || 'none'
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Failed to create payment intent:', error)
    res.status(500).json({ error: 'Failed to create payment intent', details: error.message })
  }
})

// Create Order (after successful payment)
app.post('/api/orders', async (req, res) => {
  try {
    const { 
      paymentIntentId, 
      items, 
      shippingAddress, 
      subtotal, 
      discount, 
      promoCode, 
      shipping, 
      tax, 
      total, 
      userId, 
      email,
      stripeCustomerId 
    } = req.body

    // Validate payment intent
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' })
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment has not been completed' })
    }

    // Check if order already exists
    const existingOrder = await Order.findOne({ paymentIntentId })
    if (existingOrder) {
      return res.json({ order: existingOrder, message: 'Order already exists' })
    }

    // Create order
    const order = new Order({
      userId: userId || null,
      email,
      items,
      shippingAddress,
      subtotal,
      discount,
      promoCode,
      shipping,
      tax,
      total,
      paymentIntentId,
      paymentStatus: 'succeeded',
      orderStatus: 'confirmed',
      stripeCustomerId
    })

    await order.save()

    // Send email notification to all admins
    try {
      const adminEmails = await getAllAdminEmails(Admin)
      if (adminEmails.length > 0) {
        await sendOrderNotificationToAdmins(adminEmails, order)
        console.log(`Order notification sent to ${adminEmails.length} admin(s)`)
      } else {
        console.warn('No admin emails found for order notification')
      }
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError)
      // Don't fail the order creation if email fails
    }

    res.status(201).json({ 
      order,
      message: 'Order created successfully' 
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order', details: error.message })
  }
})

// Get user orders
app.get('/api/orders', async (req, res) => {
  try {
    const userId = req.user?.id
    const email = req.query.email

    if (!userId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' })
    }

    const query = userId ? { userId } : { email }
    const orders = await Order.find(query).sort({ createdAt: -1 })

    res.json({ orders })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get single order
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params
    const order = await Order.findOne({ orderNumber })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ order })
  } catch (error) {
    console.error('Failed to fetch order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Stripe Webhook Handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder_secret_replace_with_real_secret'

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      
      // Update order payment status if order exists
      try {
        const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
        if (order) {
          const wasAlreadyConfirmed = order.orderStatus === 'confirmed'
          order.paymentStatus = 'succeeded'
          order.orderStatus = 'confirmed'
          await order.save()
          console.log('Order updated:', order.orderNumber)
          
          // Send email notification to all admins only if order was just confirmed (not already confirmed)
          if (!wasAlreadyConfirmed) {
            try {
              const adminEmails = await getAllAdminEmails(Admin)
              if (adminEmails.length > 0) {
                await sendOrderNotificationToAdmins(adminEmails, order)
                console.log(`Order notification sent to ${adminEmails.length} admin(s) via webhook`)
              }
            } catch (emailError) {
              console.error('Failed to send order notification email via webhook:', emailError)
            }
          }
        }
      } catch (error) {
        console.error('Failed to update order:', error)
      }
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('PaymentIntent failed:', failedPayment.id)
      
      // Update order payment status if order exists
      try {
        const order = await Order.findOne({ paymentIntentId: failedPayment.id })
        if (order) {
          order.paymentStatus = 'failed'
          await order.save()
        }
      } catch (error) {
        console.error('Failed to update order:', error)
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

// 404 handler - return JSON for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, health: '/api/health' })
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Google OAuth callback URL: ${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'}`)
  
  // Verify email configuration on startup (don't crash if it fails)
  verifyEmailConfig().catch(err => console.warn('Email check:', err.message))
})

