import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import authModule from '@bvodola/auth'
import crudGenerator from '@bvodola/crud'
import * as models from 'src/models/models'

const app = express()
const port = process.env.PORT || 3003

// ====
// CORS
// ====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

// =================
// Static Middleware
// =================
app.use('/static', express.static('static/'))

// ====
// Auth
// ====
const { authMiddleware } = authModule({
  app,
  tokenSecret: process.env.TOKEN_SECRET!,
  passportSecret: process.env.PASSPORT_SECRET!,
  userModel: models.User,
})

const userRoutes = crudGenerator(models.User)
app.use('/users', authMiddleware(), userRoutes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
