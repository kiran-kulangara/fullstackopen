import React from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  if (!blog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blogList">
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author} &nbsp;
        </Link>
      </div>
    </div>
  )}
export default Blog