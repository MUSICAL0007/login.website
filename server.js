require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Test route
app.get('/', (req, res) => {
  res.send('Login Website Server Running 🚀')
})

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    )

    res.json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
