const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { error } = require('../utils/logger')

// First show all the users
userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

// Then add a part to add a user
userRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body
        // If there is no password, send an error
        if (!password) {
            const error = new Error('Password must have a value')
            error.name = 'ValidationError'  // optional, matches Mongoose style
            return next(error)
        }

        // If the password has less than 3 characters
        else if (password.length < 3) {
            const error = new Error('Password must be at least 3 characters long')
            error.name = 'ValidationError'  // optional, matches Mongoose style
            return next(error)
        }
    
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
    
        const user = new User({
            username,
            name,
            passwordHash
        })
    
        const savedUser = await user.save()
    
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter