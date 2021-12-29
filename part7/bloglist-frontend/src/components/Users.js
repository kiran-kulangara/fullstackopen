import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <>
      <tr>
        <td>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </td>
        <td>{user.blogs.length}</td>
      </tr>
    </>
  )
}

const Users = ({ users }) => {
  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => <User key={user.id} user={user} />)}
        </tbody>
      </table>
    </>
  )
}

export default Users