const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: String,
  url: {type: String, required: true},
  likes: {type: Number, default: 0},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

datas = [
  {title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7},
  {title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5},
  {title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12},
  {title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10},
  {title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0},
  {title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2},
  {title: 'How to make a great blog', author: 'John Doe', url: 'http://www.johndoe.com/great-blog', likes: 15},
]

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)