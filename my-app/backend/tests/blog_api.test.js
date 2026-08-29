const app = require('../app')
const { test, after, beforeEach, before, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const config = require('../utils/config')
const bcrypt = require('bcrypt')


// Before everything else, connect to MongoDB
before(async () => {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info("Established connection")
})
let api = supertest(app)


let passwordCreationSample = 'sekret123'
let passwordDeletionSample = 'sekret456'
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    logger.info("Successfully deleted")

    // Create 2 samples: One for creating a blog, the other for deleting a blog
    // First for creating a blog
    saltRounds = 10
    const passwordCreationHash = await bcrypt.hash(passwordCreationSample, saltRounds)

    const usercreationTest = new User({
        username: "TestPerson",
        name: "Test Person",
        passwordHash: passwordCreationHash
    })

    await usercreationTest.save()
    
    // Then for deleting a blog
    const passwordDeletionHash = await bcrypt.hash(passwordDeletionSample, saltRounds)
    
    const userDeletionTest = new User({
        username: "TestDeletePerson",
        name: "Test Delete Person",
        passwordHash: passwordDeletionHash
    })
    
    await userDeletionTest.save()

    // Assign the deletion user to initial blogs
    const blogsWithUser = helper.initialBlogs.map(blog => ({
        ...blog,
        user: userDeletionTest._id
    }))

    // Insert blogs with assigned user
    await Blog.insertMany(blogsWithUser)

    logger.info('Successfully added blogs with user assigned')
})

// Then make a test to fetch the data from /api/blogs using supertest in JSON format
test('Make the GET request using supertest in JSON format', async () => {
    // The path to /api/blogs
    const responseToBlog = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    const afterExecution = await api.get('/api/blogs')
    assert(responseToBlog.length === afterExecution.length)
})


// Make a test that verifies that the unique identifier property of the blog posts is named id
test('Verify that the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert(blog.id && !blog._id)
    })
})

test('Verify that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
    // Consider the first user for testing purposes
    const blogBeforeAdding = await Blog.find({})
    const userSample = await User.findOne({ username: "TestPerson" })

    // Now try to login with the user's username and password
    const userSampleResultLogin = await api.post('/api/login')
    .send({username: userSample.username, password: passwordCreationSample})

    // Now fetch the token
    const token = userSampleResultLogin.body.token

    // Create a sample data to post to the url
    const newBlog = {
        title: "Understanding JavaScript Closures",
        author: "Jane Smith",
        url: "https://janesmith.dev/js-closures",
        likes: 8
    }

    // Then post it
    await api.post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${token}` })
    .expect(201)

    const blogAfterAdding = await Blog.find({})

    // Make a variable containing all the titles
    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(blog => blog.title)
    // Confirm it's been done and the database has a title with the sample one
    assert(blogAfterAdding.length === blogBeforeAdding.length + 1)
    assert(blogTitles.includes("Understanding JavaScript Closures"))
})

// Now make a test for deleting a blog
test('Delete a blog', async () => {
    // Consider the first user for testing purposes
    const userSample = await User.findOne({ username: "TestDeletePerson" })

    // Now try to login with the user's username and password
    const userSampleResultLogin = await api.post('/api/login')
    .send({username: userSample.username, password: passwordDeletionSample})

    // Now fetch the token
    const token = userSampleResultLogin.body.token

    // First return all the blogs
    const blogsBeforeDeletion = await Blog.find({})
    // Then choose the first blog to delete
    const blogToDelete = blogsBeforeDeletion[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `Bearer ${token}` })
    .expect(204)

    const blogsAfterDeletion = await Blog.find({})
    // Assert that the length has decreased and the id no longer exists
    assert.deepStrictEqual(blogsAfterDeletion.length, blogsBeforeDeletion.length - 1)
    assert(!blogsAfterDeletion.some(blog => blog.id === blogToDelete.id))
})

test('Deleting a blog without the token', async () => {
    const blogsBeforeDeletion = await Blog.find({})
    const blogToDelete = blogsBeforeDeletion[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(401)

    const blogsAfterDeletion = await Blog.find({})
    assert.deepStrictEqual(blogsBeforeDeletion.length, blogsAfterDeletion.length)

    const existingBlog = await Blog.findById(blogToDelete.id)
    assert(existingBlog)

})

// Update a blog
test('Update a blog', async () => {
    const blogBeforeUpdate = await Blog.find({})
    let blogToUpdate = blogBeforeUpdate[0]
    let blogToUpdateId = blogBeforeUpdate[0].id
    blogToUpdate = {
        title: "Building REST APIs with Express",
        author: "Dana Webdev",
        url: "https://danaweb.dev/express-apis",
        likes: 18
    }

    await api.put(`/api/blogs/${blogToUpdateId}`)
    .send(blogToUpdate)
    .expect(200)

    const blogAfterUpdate = await Blog.find({})
    const updatedBlog = blogAfterUpdate.find(blog => blog.id === blogToUpdateId)

    // Assert that the length is the same
    assert.deepStrictEqual(blogBeforeUpdate.length, blogAfterUpdate.length)
    // the updated blog is there
    assert(updatedBlog)
    
    for (const [key, value] of Object.entries(blogToUpdate)) {
        assert.strictEqual(updatedBlog[key], value)
    }
})

test('Verify that if the likes property is missing from the request, it will default to the value 0', async () => {

    // Log in as TestPerson (or another user with token)
    const userSample = await User.findOne({ username: "TestPerson" })
    const loginResponse = await api.post('/api/login')
    .send({ username: userSample.username, password: passwordCreationSample })
    
    const token = loginResponse.body.token

    // Post the blog without likes
    const newBlogSample = {
    title: "A Guide to Node.js Streams",
    author: "John Developer",
    url: "https://nodeguide.com/streams"
    }

    await api.post('/api/blogs')
    .send(newBlogSample)
    .set({ Authorization: `Bearer ${token}` }) // <-- Important
    .expect(201) // Make sure it succeeds

       // Now fetch all blogs
    const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const sampleData = response.body.find(blog => blog.title === 'A Guide to Node.js Streams')

    assert(sampleData, 'Blog was not found in the database')
    assert.strictEqual(sampleData.likes, 0)
})


test('Verify that if the title or url are missing from the request data, the backend responds it with the status code 400 "Bad Request"', async () => {
    // Log in as TestPerson (or another user with token)
    const userSample = await User.findOne({ username: "TestPerson" })
    const loginResponse = await api.post('/api/login')
    .send({ username: userSample.username, password: passwordCreationSample })
    
    const token = loginResponse.body.token


    // First make the sample data
    const blogSampleNoAuthor = {
        author: "Alice Johnson",
        url: "https://cssworld.com/grid-flexbox",
        likes: 20
    }
    const blogSampleNoUrl = {
        title: "Functional Programming in Python",
        author: "Eve Programmer",
        likes: 5
    }
    // Now send the new datas
    await api.post('/api/blogs')
    .send(blogSampleNoAuthor)
    .set({ Authorization: `Bearer ${token}` })
    .expect(400)

    await api.post('/api/blogs')
    .send(blogSampleNoUrl)
    .set({ Authorization: `Bearer ${token}` })
    .expect(400)
})



describe.only('When a someone creates a user,', () => {
    test('Invalid username is yeeted', async () => {
        // Make a user sample that violates the username constraint
        const usersBeforeInsertion = await User.find({})
        const userSample = {
            username: "Al",
            name: "Ali Rashidi",
            password: "RashidiAli"
        }
        // Expect rejection from it
        await api.post('/api/users')
        .send(userSample)
        .expect(400)

        // Make sure the size is the same before and after insertion
        const usersAfterInsertion = await User.find({})
        assert.deepStrictEqual(usersBeforeInsertion.length, usersAfterInsertion.length)

        // Make sure the user does not exist
        const invalidUser = await User.findOne({ username: "Al" })
        assert(!invalidUser)
    }),
    test('Invalid password is yeeted', async () => {
        // Make a user sample that violates the username constraint
        const usersBeforeInsertion = await User.find({})
        const userSample = {
            username: "Serwa",
            name: "Serwa Mostowfi",
            password: "Mo"
        }
        // Expect rejection from it
        await api.post('/api/users')
        .send(userSample)
        .expect(400)

        // Make sure the size is the same before and after insertion
        const usersAfterInsertion = await User.find({})
        assert.deepStrictEqual(usersBeforeInsertion.length, usersAfterInsertion.length)

        // Make sure the user does not exist
        const invalidUser = await User.findOne({ username: "Serwa" })
        assert(!invalidUser)
    })
})

after(async () => {
    await mongoose.connection.close()
})
