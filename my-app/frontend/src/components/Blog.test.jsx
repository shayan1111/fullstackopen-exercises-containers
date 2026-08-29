import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Togglable from './Togglable'
import { FormData } from 'node-fetch' // or 'formdata-node' package

// The Blog sample
const blogSample = ({
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com',
  likes: 7
})

// The username
const username = { name: 'Michael Chan' }

describe('Blog', () => {
  test('By default, you can only see the author and title', () => {
    // Now Render the Blog
    render(<Blog blog={blogSample} username={username} />)

    // Assert that the title is shown by default
    const titleElement = screen.getAllByText(new RegExp(blogSample.title))
    expect(titleElement[0]).toBeVisible()

    // Assert that the author is shown by default
    const authorElement = screen.getAllByText(new RegExp(blogSample.author))
    expect(authorElement[0]).toBeVisible()

    // Assert that the url and likes are not visible
    const urlElement = screen.getAllByText(new RegExp(blogSample.url))
    expect(urlElement[0]).not.toBeVisible()

    const likesElement = screen.getAllByText(new RegExp(`likes ${blogSample.likes}`))
    expect(likesElement[0]).not.toBeVisible()
  }),

  test('When the button is clicked, it would show the url and likes as well', async () => {
    // First render the Blog
    render(<Blog blog={blogSample} username={username}/>)

    // Then stimulate the user clicking the button
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // Assert that the url and likes are visible after the click
    const urlElement = screen.getByText(new RegExp(blogSample.url))
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText(new RegExp(`likes ${blogSample.likes}`))
    expect(likesElement).toBeVisible()
  }),

  test('Correctly show the amount of times the like button has been clicked', async () => {
    // First make a mock function for the likes
    const MockFunctionLike = vi.fn()

    // Then render the component
    render(<Blog blog={blogSample} username={username} onLike={MockFunctionLike} />)

    // After that show the like value
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // Then click the like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Finally assert that the like button has been called exactly 2 times
    expect(MockFunctionLike.mock.calls).toHaveLength(2)
  }),

  test('Make a test for the new blog form', async () => {
    //Firstly make a mock function
    const MockFunctionSubmit = vi.fn()

    // Then a function that creates an object and assigns it to the mock function
    const submitFunction = (event) => {
      event.preventDefault()
      const newBlog = {
        title: event.target.elements.title.value,
        author: event.target.elements.author.value,
        url: event.target.elements.url.value
      }

      MockFunctionSubmit(newBlog)
    }

    // Render the Togglable
    render(
      <Togglable blogs={[blogSample]} name={username}>
        <div>
          {/* Then a part to create a new blog */}
          <h2>create new</h2>
          {/* Create a form for submitting a blog */}
          <form onSubmit={submitFunction}>
            {/* Title */}
            title:<input name="title" placeholder='title' />
            <br></br>
            {/* Author */}
            author:<input name="author" placeholder='author' />
            <br></br>
            {/* URl */}
            url:<input name="url" placeholder='url' />
            <br></br>
            {/* And a button for creating the blog */}
            <button type='submit'>create</button>
          </form>
        </div>
      </Togglable>)

    // Then create the user setup for testing
    const user = userEvent.setup()

    // Now fill in the inputs
    const titleInput = screen.getByPlaceholderText('title')
    await user.type(titleInput, blogSample.title)

    const authorInput = screen.getByPlaceholderText('author')
    await user.type(authorInput, blogSample.author)

    const urlInput = screen.getByPlaceholderText('url')
    await user.type(urlInput, blogSample.url)

    // Click on the create button
    const createButton = screen.getByText('create')
    await user.click(createButton)

    // Assert that the Mock function was called exactly once
    expect(MockFunctionSubmit.mock.calls).toHaveLength(1)

    // Also make sure it has the values passed down from the test
    expect(MockFunctionSubmit.mock.calls[0][0].title).toBe(blogSample.title)
    expect(MockFunctionSubmit.mock.calls[0][0].author).toBe(blogSample.author)
    expect(MockFunctionSubmit.mock.calls[0][0].url).toBe(blogSample.url)
  })
})