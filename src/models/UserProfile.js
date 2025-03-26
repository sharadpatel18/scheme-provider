import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['single', 'married', 'divorced', 'widowed']
  },
  
  // Contact Information
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  alternatePhone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Address Information
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
  },
  
  // Identity Information
  aadhaarNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhaar number']
  },
  panNumber: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  
  // Educational Information
  education: {
    type: String,
    required: true,
    enum: ['high-school', 'undergraduate', 'graduate', 'post-graduate']
  },
  occupation: {
    type: String,
    required: true,
    enum: ['student', 'employed', 'self-employed', 'unemployed']
  },
  // Additional Information
  category: {
    type: String,
    required: true,
    enum: ['general', 'sc', 'st', 'obc']
  },
  disability: {
    type: String,
    required: true,
    enum: ['yes', 'no']
  },
  disabilityType: {
    type: String,
    required: function() {
      return this.disability === 'yes';
    }
  },
  disabilityPercentage: {
    type: String,
    required: function() {
      return this.disability === 'yes';
    },
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Disability percentage must be between 0 and 100'
    }
  },
  
  // Preferences
  preferredLanguage: {
    type: String,
    required: true,
    enum: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'],
    default: 'English'
  },
  communicationMode: {
    type: String,
    required: true,
    enum: ['email', 'sms', 'both'],
    default: 'email'
  }
}, {
  timestamps: true
});

// Create indexes
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ aadhaarNumber: 1 });
userProfileSchema.index({ panNumber: 1 });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema); 