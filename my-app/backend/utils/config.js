require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'development'  // ✅ read from process.env

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const PORT = process.env.PORT

console.log('NODE_ENV:', NODE_ENV)
console.log('Using MongoDB URI:', MONGODB_URI)

module.exports = { MONGODB_URI, PORT }