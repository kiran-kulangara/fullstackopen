import React, { useState } from 'react'

const Blog = ({ blog, user, handleUpdateLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
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

  const details = () => (
    <>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={updateLike}>like</button>
      </div>
      <div id="creatorName">{blog.user.name}
        <div>
          {blog.user.username === user.username ? <button id="remove-button" onClick={removeBlog}>remove</button> : null}
        </div>
      </div>
    </>
  )

  return (
    <div style={blogStyle} className="blogList">
      <div>
        {blog.title} {blog.author} &nbsp;
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && details()}
    </div>
  )}
export default Blog