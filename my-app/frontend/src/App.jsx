import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import { jwtDecode } from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [decodedUser, setDecodedUser] = useState(null)

  const blogFormRef = useRef()

  // Sort the blogs by their likes, and then pass it down in Togglable
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
  
  // Update the blogs while booting and after user has changed
  useEffect(() => {
  if (user) {
    blogService.getAll().then(blogsFromBackend => {
      setBlogs(blogsFromBackend)
    })
  }
}, [user])

  let decoded

  // Also remember the logged in users even after refresh
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const decoded = jwtDecode(user.token)
      setDecodedUser(decoded)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handle the Username
  const handleUsername = (event) => {
    setUsername(event.target.value)
  }
  
  // Handle the Password
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }
  
  // Handle the Title of the blog
  const handleTitle = (event) => {
    setTitle(event.target.value)
  }
  
  // Handle the Author of the blog
  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }
  
  // Handle the URL of the blog
  const handleUrl = (event) => {
    setUrl(event.target.value)
  }
  
  // Handle the Login
  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      const decoded = jwtDecode(user.token)   
      setDecodedUser(decoded)   
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    } catch (error) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  // Handle the Logout
  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }
  
  // Handle creating a blog
  const handleNewBlog = async (event) => {
    try {
      event.preventDefault()
      blogFormRef.current.toggleVisibility()
      // Create a new object for the new blog
      const newBlog = {
        title: title,
        author: author,
        url: url,
        user: user
      }
      
      // Send to backend and add to the list
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      
      
      // Show a message if it was a success
      setSuccessMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      
      // Clear the inputs
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      // Add a warning message
      setErrorMessage(error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const showBlogCreationDetail = () => {
    return (
    <div>
    {/* Then a part to create a new blog */}
        <h2>create new</h2>
        {/* Create a form for submitting a blog */}
        <form onSubmit={handleNewBlog}>
          {/* Title */}
          <label>
            title:<input value={title} onChange={handleTitle} />
            <br></br>
          </label>
          {/* Author */}
          <label>
            author:<input value={author} onChange={handleAuthor} />
            <br></br>
          </label>
          {/* URl */}
          <label>
            url:<input value={url} onChange={handleUrl} />
            <br></br>
          </label>
          {/* And a button for creating the blog */}
          <button type='submit'>create</button>
        </form>
    </div>
    )
  }

  // update the blog's likes
  const handleLike = async (blog) => {
  const updatedBlog = await blogService.updatedLikes(blog)
  setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }

  const onDelete = async (idToDelete) => {
  try {
    await blogService.deleteBlog(idToDelete)
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== idToDelete))
      } catch (err) {
    console.error('Delete failed', err.response?.data || err.message)
    alert('Delete failed')
    }
  }
  
  // Set up a condition that if the user is null, show the login form
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          {/* First the username */} 
          <label>
            username
            <input value={username} onChange={(event) => handleUsername(event)}/> 
            <br></br>
          </label>
          {/* Then the password */}
          <label>
            password <input value={password} onChange={(event) => handlePassword(event)}/>
            <br></br>
          </label>
          {/* And finally the button */}
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }
  
  // Else if the user isn't null, show the blogs
  return (
    <div>
      {successMessage && <div className="success">{successMessage}</div>}
      {/* First the blogs header, who has logged in and a button to log out */}
      <h2>blogs</h2>
      {user.name} logged in  <button onClick={handleLogout}>logout</button>
      {/* Now use the togglable for creating the blogs */}
      <Togglable blogs={sortedBlogs} ref={blogFormRef} name={user} onLike={handleLike} onDelete={onDelete} user={decodedUser} >
        {/* Display the inputs to create a blog */}
        {showBlogCreationDetail()}
      </Togglable>
    </div>
  )
}

export default App