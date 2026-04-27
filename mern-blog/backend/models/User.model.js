import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    // ── Core Fields ──────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],  // Custom error message
      trim: true,                              // Removes leading/trailing spaces
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,            // Creates a MongoDB index — fast lookups + no duplicates
      lowercase: true,         // Stores as lowercase always
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,  // ← CRITICAL: password NEVER returned in queries by default
                      // Must explicitly request: User.findOne().select('+password')
    },

    avatar: {
      type: String,
      default: '',  // Will store Cloudinary URL later
    },

    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },

    // ── Role & Permissions ───────────────────
    role: {
      type: String,
      enum: ['user', 'admin'],  // Only these two values allowed
      default: 'user',
    },

    // ── Engagement ───────────────────────────
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',  // References the Post model — for .populate()
      }
    ],

    // ── Account Status ────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    // Mongoose manages these — you never set them manually
    timestamps: true,
  }
)

// ─────────────────────────────────────────────
// MIDDLEWARE (Mongoose Hooks)
// "pre save" = runs BEFORE every .save() call
// ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // "this" = the document being saved

  // Only hash if password was actually modified
  // Without this check: every time you save ANY user field,
  // the already-hashed password gets hashed AGAIN → login breaks
  if (!this.isModified('password')) return next()

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 12 means 2^12 = 4096 hashing iterations
  // Higher = more secure but slower. 12 is the production sweet spot
  this.password = await bcrypt.hash(this.password, 12)
  next()  // Continue to the save operation
})

// ─────────────────────────────────────────────
// INSTANCE METHODS
// Methods available on every User document instance
// ─────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare() hashes the candidatePassword and compares it
  // to this.password (the stored hash)
  // Returns true if they match, false if not
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output even when select:false is bypassed
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model('User', userSchema)
export default User