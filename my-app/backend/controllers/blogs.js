const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// Show the current data
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// send the current data
blogsRouter.post('/', userExtractor, async (request, response) => {
  try {
    const body = request.body

    const user = request.user

    // Create a new Object, with the user pointing to the id of the user
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    // Save the user, push the blog id to the blogs in the user schema and save that later on
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({ error:error.message })
  }
})

// delete a blog 
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  try {
    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).json({ error:"Blog does not exist" })

      if (blog?.user?.toString() === user?.id?.toString()) {
        const result = await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
      } else return response.status(403).end()

  } catch (error) {
    response.status(400).json({ error:error.message })
  }
})

// Update a blog
blogsRouter.put('/:id', async (request, response) => {
  try {
    const idBlogToUpdate = request.params.id
    const updatedBlog = await Blog.findByIdAndUpdate(
      idBlogToUpdate,
      request.body,
      {new: true, runValidators: true}
    ).populate('user', { username: 1, name: 1 })

    response.status(200).json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error:error.message })
  }
})


module.exports = blogsRouter