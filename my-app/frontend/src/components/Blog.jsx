import { useState } from "react"

const Blog = ({ blog, username, onLike, onDelete, userObject }) => {
  // First make the variable to show the details or not
  const [visibility, setVisibility] = useState(false)
  
  // Then make 2 variables to show them
  const hideWhenVisible = { display: visibility ? 'none' : '' }
  const showWhenVisible = { display: visibility ? '' : 'none' }
  
  // Make a function that changes the visibility value
  const toggleVisibility = () => {
    setVisibility(!visibility)
  }
  
  // Define it's style
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {/* Only show the title and author for when visibility is false */}
      <div style={hideWhenVisible} data-cy={`blog-${blog.id}`} className="blog-to-show" >
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>

      <div style={showWhenVisible} >
        {/* Now show their details once visibility is true */}
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <br></br>
        {/* Then the url */}
        {blog.url}
        <br></br>
        {/* The likes */}
        likes {blog.likes} <button onClick={onLike}>like</button>
        <br></br>
        {/* The username */}
        {username.name}
        <br></br>
        {/* Then the remove button */}
        { blog?.user?.id === userObject?.id && <button onClick={() => {
          if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
            console.log(blog)
            console.log(blog.user.id)
            console.log(userObject.id)
            onDelete(blog.id)
            }
          }
        }>
          remove
          </button> }
      </div>
    </div>
  )
}

export default Blog