import React from 'react'

const UserView = ({ userToView }) => {
  if (!userToView) {
    return null
  }

  return (
    <div>
      <div>
        <h2>{userToView.name}</h2>
      </div>
      <div>added blogs</div>
      <ul>
        {userToView.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default UserView