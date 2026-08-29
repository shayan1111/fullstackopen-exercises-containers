const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const datas = [
    {
        "title": "React patterns",
        "author": "Michael Chan",
        "url": "https://reactpatterns.com/",
        "likes": 7,
        "id": "698eece6cfd3e42eb88088d7"
    },
    {
        "title": "Go To Statement Considered Harmful",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        "likes": 5,
        "id": "698eece6cfd3e42eb88088d8"
    },
    {
        "title": "Canonical string reduction",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        "likes": 12,
        "id": "698eece6cfd3e42eb88088d9"
    },
    {
        "title": "First class tests",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        "likes": 10,
        "id": "698eece6cfd3e42eb88088da"
    },
    {
        "title": "TDD harms architecture",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        "likes": 0,
        "id": "698eece6cfd3e42eb88088db"
    },
    {
        "title": "Type wars",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        "likes": 2,
        "id": "698eece6cfd3e42eb88088dc"
    },
    {
        "title": "How to make a great blog",
        "author": "John Doe",
        "url": "http://www.johndoe.com/great-blog",
        "likes": 15,
        "id": "698f0ee4bd6a0dce684eb331"
    }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
    const result = listHelper.favoriteBlog(datas)
    assert.deepStrictEqual(result, 15)
})

describe('most blogs', () => {
    const result = listHelper.mostBlogs(datas)
    assert.deepStrictEqual(result, 
    {
        author: "Robert C. Martin",
        blogs: 3
    })
})

describe('most likes', () => {
    const result = listHelper.mostLikes(datas)
    assert.deepStrictEqual(result, 
        {author: "Edsger W. Dijkstra", likes: 17}
    )
})

