const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    // First look for the amount of likes in the array of objects
    return initialValue = blogs.reduce((sum, blogs) => sum + blogs.likes, 0)
}

const favoriteBlog = (blogs) => {
    const mostLikesInArray = blogs.map(b => b.likes)
    return Math.max(...mostLikesInArray)
}

const mostBlogs = (blogs) => {
    // First group them together by the author
    const grouped = _.groupBy(blogs, 'author');
    // Then find out how many blogs an author has written
    const blogsWritten = _.map(grouped, (value, key) => {
        const count = value.length
        return { author: key, blogs: count }
    })
    // Finally return the one with the most blogs written
    return _.maxBy(blogsWritten, item => item.blogs)
}

const mostLikes = (blogs) => {
    // First group them together by the author
    const grouped = _.groupBy(blogs, 'author')
    // Then find out how many likes an author has
    const blogsLike = _.map(grouped, (value, key) => {
        let totalLikes = 0
        for (let i = 0; i < value.length; i++) {
            totalLikes += value[i].likes
        }
        return {author: key, likes: totalLikes}
    })
    // Lastly show the author with the most amount of likes
    return _.maxBy(blogsLike, item => item.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}