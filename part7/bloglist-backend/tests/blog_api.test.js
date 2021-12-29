const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initailBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initailBlogs[1])
  await blogObject.save()
})
const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('Blog list tests, step1 : all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initailBlogs.length)
})

test('Blog list tests, step2 : unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]
  expect(blog.id).toBeDefined()
})

describe('Tests with Authorization token', () => {

  test('Blog list tests, step3 : a valid blog can be added', async () => {
    await User.deleteMany({})
    const testUser = await new User({
      username: 'TestUser',
      passwordHash: await bcrypt.hash('testpassword', 10),
    }).save()

    const userForToken = { username: 'TestUser', id: testUser.id }
    const token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      title: 'async-await simplifies making async calls',
      author: 'Asyncer',
      url: 'https://sampleurl.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initailBlogs.length + 1)
    expect(title).toContain(
      'async-await simplifies making async calls'
    )
  })

  test('Blog list tests, step4 : likes property is missing will default to 0', async () => {
    await User.deleteMany({})
    const testUser = await new User({
      username: 'TestUser',
      passwordHash: await bcrypt.hash('testpassword', 10),
    }).save()

    const userForToken = { username: 'TestUser', id: testUser.id }
    const token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      title: 'likes property is missing',
      author: 'Nobody',
      url: 'https://nobodyurl.com/',
    }

    const resultBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toBe(0)
  })

  test('Blog list tests, step5 : title and url properties are missing will respond with status code 400 Bad Request', async () => {
    await User.deleteMany({})
    const testUser = await new User({
      username: 'TestUser',
      passwordHash: await bcrypt.hash('testpassword', 10),
    }).save()

    const userForToken = { username: 'TestUser', id: testUser.id }
    const token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      author: 'Nobody',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initailBlogs.length)
  })

  test('Blog list expansions, step1 : a blog can be deleted', async () => {
    await User.deleteMany({})
    const testUser = await new User({
      username: 'TestUser',
      passwordHash: await bcrypt.hash('testpassword', 10),
    }).save()

    const userForToken = { username: 'TestUser', id: testUser.id }
    const token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      title: 'Nobody',
      author: 'Nobody',
      url: 'nobody.com',
      likes: 10
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAfterAdd = await helper.blogsInDb()
    const contentsAfterAdd = blogsAfterAdd.map(r => r.title)
    expect(contentsAfterAdd).toContain(result.body.title)

    await api
      .delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    const contentsAfterDelete = blogsAfterDelete.map(r => r.title)
    expect(contentsAfterDelete).not.toContain(result.body.title)
  })

})

describe('Tests without Authorization token', () => {
  test('4.23*: bloglist expansion, step11 : a blog cannot be added if a token is not provided', async () => {
    const newBlog = {
      title: 'async-await simplifies making async calls',
      author: 'Asyncer',
      url: 'https://sampleurl.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const title = response.body.map(r => r.title)

    expect(title).not.toContain(
      'async-await simplifies making async calls'
    )
  })
})

test('Blog list expansions, step2 : updating the information of an individual blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogsToUpdate = blogsAtStart[0]

  const updatedObj = {
    ...blogsToUpdate,
    likes : 9
  }

  const updatedBlog = await api
    .put(`/api/blogs/${blogsToUpdate.id}`)
    .send(updatedObj)
    .expect(200)

  expect(updatedBlog.body).not.toEqual(updatedObj.likes)
})

afterAll(() => {
  mongoose.connection.close()
  console.log('Closed connection to MongoDB')
})