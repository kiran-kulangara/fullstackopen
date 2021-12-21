import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [ notification, setNewNotification ] = useState({ message: null, isSuccess:null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
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
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p> {user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleUpdateLike={handleUpdateLike}
          handleDelete={handleDelete} className='blog' />
      )}
    </div>
  )
}

export default App