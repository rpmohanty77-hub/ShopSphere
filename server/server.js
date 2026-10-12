
const express = require('express')
const cors = require('cors')
const productRoutes = require('./routes/productRoutes')

require('dotenv').config()

const connectDB = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/products', productRoutes)

// Welcome API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShopSphere API is running!',
  })
})

// Health-check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'ShopSphere Backend',
  })
})

// Connect database before starting the server
async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(
        `ShopSphere server running on http://localhost:${PORT}`,
      )
    })
  } catch (error) {
    console.error('Failed to start ShopSphere:', error.message)
    process.exit(1)
  }
}

startServer()
