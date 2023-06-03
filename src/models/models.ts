import mongoose, { Schema, model } from 'mongoose'
import { IUser, UserType } from './models.types'

/**
 * Model declarations
 */

// ****
// User
// ****

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
  type: {
    type: String,
    enum: UserType,
    default: UserType.Customer,
  },
})

/**
 * Exporting Models
 */
export const User = model<IUser>('User', userSchema)

/**
 * Running the database
 */
run().catch((err) => console.error(err))

async function run() {
  // 4. Connect to MongoDB
  // @see https://cloud.mongodb.com/v2/63d9c2e5e602ca3693783d06#/clusters
  console.log('[db] MongoDB Connecting...')
  const MONGODB_URL = process.env.MONGODB_URL

  if (MONGODB_URL) {
    mongoose.set('strictQuery', false)
    await mongoose.connect(MONGODB_URL)
    console.log('[db] MongoDB Successfully Connected')
  }
}
