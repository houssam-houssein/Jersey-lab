import mongoose from 'mongoose'

const designFileSchema = new mongoose.Schema({
  file: { type: String, required: true }, // Base64 data URL
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }
}, { _id: false })

const teamwearInquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  designFiles: [designFileSchema], // Array of design files (up to 5)
  // Legacy support - keep old fields for backward compatibility
  designFile: { type: String },
  fileName: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String } // Admin notes
}, { timestamps: true })

const TeamwearInquiry = mongoose.model('TeamwearInquiry', teamwearInquirySchema)
export default TeamwearInquiry

