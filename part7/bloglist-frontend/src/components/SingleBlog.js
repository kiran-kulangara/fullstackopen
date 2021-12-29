import React from 'react'
import { Button } from './styledComponents/styledComponents'

const SingleBlog = ({ blog, user, handleUpdateLike, handleDelete }) => {

  if (!blog) {
    return null
  }

  const updateLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    handleUpdateLike(updatedBlog)
  }

  const removeBlog = () => {
    const res = window.confirm(`remove ${blog.title} by ${blog.author}`)

    if (res) {
      handleDelete(blog.id)
    }
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        <Button onClick={updateLike}>like</Button>
      </div>
      <div id="creatorName">added by {blog.user.name}
        <div>
          {blog.user.username === user.username ? <button id="remove-button" onClick={removeBlog}>remove</button> : null}
        </div>
      </div>
    </div>
  )
}

export default SingleBlog