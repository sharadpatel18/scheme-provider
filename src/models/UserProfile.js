import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dob: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  alternatePhone: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  aadhaarNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
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
    required: function() { return this.disability === 'yes'; }
  },
  disabilityPercentage: { 
    type: Number,
    required: function() { return this.disability === 'yes'; },
    min: 0,
    max: 100
  },
  preferredLanguage: { 
    type: String, 
    required: true,
    enum: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi']
  },
  communicationMode: { 
    type: String, 
    required: true,
    enum: ['email', 'sms', 'both']
  }
}, {
  timestamps: true
});

// Create indexes
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ aadhaarNumber: 1 });
userProfileSchema.index({ panNumber: 1 });

// Handle duplicate key errors
userProfileSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A profile with this email, Aadhaar number, or PAN number already exists'));
  } else {
    next(error);
  }
});

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile; 