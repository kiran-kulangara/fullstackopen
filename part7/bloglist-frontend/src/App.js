import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Users from './components/Users'
import UserView from './components/UserView'
import { Button, Page, Navigation } from './components/styledComponents/styledComponents'

import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Navigation>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user.name} logged in <Button onClick={handleLogout}>logout</Button>
      </Navigation>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [ notification, setNewNotification ] = useState({ message: null, isSuccess:null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const history = useHistory()

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [user])

  useEffect(() => {
    userService.getAll().then(allUsers =>
      setAllUsers(allUsers)
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {

    try {
      const result = await blogService.create(blogObject)
      result.user = user
      setBlogs(blogs.concat(result))
      handleNotifcation({
        message   : `a new blog ${blogObject.title} by ${blogObject.author} added`,
        isSuccess : true
      })
      blogFormRef.current.toggleVisibility()
    } catch (exception){
      handleNotifcation({
        message   : `${exception.response.data.error}`,
        isSuccess : false
      })
    }

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNotifcation = (notificationObject) => {
    setNewNotification(notificationObject)
    setTimeout(() => {
      setNewNotification({
        message   : null,
        isSuccess : null
      })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
      history.push('/')
    } catch (exception) {
      handleNotifcation({
        message   : 'wrong username or password',
        isSuccess : false
      })
    }
  }

  const handleUpdateLike = async (blogObject) => {
    const updatedBlog = await blogService.update(blogObject.id, blogObject)
    const updatedLikesBlogs = blogs.map((blog) => {
      return blog.id === updatedBlog.id ? blogObject : blog
    })
    setBlogs(updatedLikesBlogs)
  }

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      const updatedBlogsList = blogs.filter((blog) => blog.id !== id)
      handleNotifcation({
        message   : 'blog successfully removed',
        isSuccess : true
      })
      setBlogs(updatedBlogsList)
    } catch (exception) {
      if (exception.response.status === 404) {
        const updatedBlogsList = blogs.filter((blog) => blog.id !== id)
        setBlogs(updatedBlogsList)
        handleNotifcation({
          message   : `${exception.response.data.error}, it might have been removed from the server`,
          isSuccess : false
        })
      } else {
        handleNotifcation({
          message   : `${exception.response.data.error}`,
          isSuccess : false
        })
      }
    }
  }

  blogs.sort((a, b) => Number(b.likes) - Number(a.likes))

  const blogForm = () => (
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <BlogForm createBlog ={addBlog} />
    </Togglable>
  )

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogById = (id) =>
    blogs.find(a => a.id === id)

  const userById = (id) =>
    allUsers.find(a => a.id === id)

  const matchBlog = useRouteMatch('/blogs/:id')
  const blog = matchBlog
    ? blogById(matchBlog.params.id)
    : null

  const matchUser = useRouteMatch('/users/:id')
  const userToView = matchUser
    ? userById(matchUser.params.id)
    : null

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Page>
        <Menu user={user} handleLogout={handleLogout} />
        <h2>blog app</h2>
        <Notification notification={notification} />

        <Switch>
          <Route path="/blogs/:id">
            <SingleBlog
              blog={blog}
              user={user}
              handleUpdateLike={handleUpdateLike}
              handleDelete={handleDelete} className='blog' />
          </Route>
          <Route path="/users/:id">
            <UserView userToView={userToView} />
          </Route>
          <Route path="/users">
            <Users users={allUsers} />
          </Route>
          <Route path="/">
            {blogForm()}
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleUpdateLike={handleUpdateLike}
                handleDelete={handleDelete} className='blog' />
            )}
          </Route>
        </Switch>
      </Page>
    </div>
  )
}

export default App