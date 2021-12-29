const dummy = () => {
  return 1
}

const totalLikes = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const favoriteBlog = array => {
  const reducer = (favorite, item) => {

    if (!favorite.likes) {  // for the first item
      favorite.title = item.title
      favorite.author = item.author
      favorite.likes = item.likes
      return favorite
    }

    if (item.likes >= favorite.likes) {
      favorite.title = item.title
      favorite.author = item.author
      favorite.likes = item.likes
    }
    return favorite
  }

  return array.length === 0
    ? {}
    : array.reduce(reducer, {})
}

const mostBlogs = array => {
  if (array.length === 0) {
    return {}
  }

  const reducer = (noOfBlog, { author }) => {
    noOfBlog[author] = noOfBlog[author] || 0
    noOfBlog[author] += 1
    return noOfBlog
  }

  const noOfBlogList = array.reduce(reducer, {})
  const authorWithMostBlogs = {
    author: Object.keys(noOfBlogList).reduce((a, b) => noOfBlogList[a] > noOfBlogList[b] ? a : b),
    blogs: Math.max(...Object.values(noOfBlogList))
  }

  return authorWithMostBlogs
}

const mostLikes = array => {
  if (array.length === 0) {
    return {}
  }

  const reducer = (noOfLikes, { author, likes }) => {
    noOfLikes[author] = noOfLikes[author] || 0
    noOfLikes[author] += likes
    return noOfLikes
  }

  const noOfLikesList = array.reduce(reducer, {})
  const authorWithMostLikes = {
    author: Object.keys(noOfLikesList).reduce((a, b) => noOfLikesList[a] > noOfLikesList[b] ? a : b),
    likes: Math.max(...Object.values(noOfLikesList))
  }

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}