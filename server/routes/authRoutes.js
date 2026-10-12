
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    const token = jwt.sign(
      { role: 'admin', username: process.env.ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      expiresIn: '1h',
    })
  } catch (error) {
    console.error('Admin login error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to process login',
    })
  }
})

module.exports = router
