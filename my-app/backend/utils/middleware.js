const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info(`Method: ${request.method}`)
    logger.info(`Path: ${request.path}`)
    logger.info(`Body: ${request.body}`)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    } 
    else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

// Create the user identification
const userExtractor = async (request, response, next) => {
    // Firstly, verify that request.token is not null
    if (!request.token) return response.status(401).json({ error: 'missing token' })
    
    // Then decode and verify the token
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken) return response.status(401).json({ error: 'token invalid' })

    // After that, find the user with the Token's id
    const user = await User.findById(decodedToken.id)
    if (!user) return response.status(401).json({ error: 'userId missing or not valid' })

    // And finally set the user from request to the user
    request.user = user

    // Proceed with the next one
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}