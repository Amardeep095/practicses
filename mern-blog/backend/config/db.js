// config/db.js
// Responsibility: ONE place that handles MongoDB connection
// If this file changes, nothing else in your app needs to change

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise
    // We await it — if it fails, we catch below
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    // conn.connection.host = the MongoDB Atlas cluster host
    // This confirms WHICH database we connected to
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)

  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`)
    // process.exit(1) = shut down the server with an error code
    // Why? If DB connection fails, the whole app is broken anyway
    // Better to crash loudly than silently serve broken responses
    process.exit(1)
  }
}

export default connectDB