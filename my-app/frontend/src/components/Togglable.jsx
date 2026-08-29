import { useState, useImperativeHandle } from 'react'
import Blog from './Blog'

const Toggleable = (props) => {
    // First create a state for it's visibility
    const [visibility, setVisibility] = useState(false)

    // Destruct the blogs
    const { blogs } = props

    // Then variables for when it's hidden or not
    const hideWhenVisible = { display: visibility ? 'none' : '' }
    const showWhenVisible = { display: visibility ? '' : 'none' }
    
    // Make a function that changes the value of 'visibility'
    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
    })

    return (
        <div>
            {/* First for creating a blog */}
            <div style={hideWhenVisible}  className="blog-form-visible" >
                <button onClick={toggleVisibility}>create new blog</button>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} username={props.name} onLike={() => props.onLike(blog)} onDelete={props.onDelete} userObject={props.user} />
                )}
            </div>
    
            {/* Then the inputs */}
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )

}

export default Toggleable