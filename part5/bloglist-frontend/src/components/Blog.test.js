import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Togglable />', () => {
  let component
  let mockHandler
  beforeEach(() => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Tester',
      url: 'www.test.com',
      likes: 0,
      user: { username : 'Testuser', name: 'Testuser' }

    }

    const user = {
      username: 'Testuser', name: 'Testuser'
    }

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} user={user} handleUpdateLike={mockHandler}/>
    )
  })

  test('Blog list tests, step1 : blog renders only title and author initially', () => {

    expect(component.container).toHaveTextContent(
      'Component testing is done with react-testing-library'
    )
    expect(component.container).toHaveTextContent(
      'Tester'
    )

    expect(component.container).not.toHaveTextContent(
      'www.test.com'
    )

    expect(component.container).not.toHaveTextContent(
      '0'
    )

    expect(component.container).not.toHaveTextContent(
      'Testuser'
    )

    expect(component.container).toHaveTextContent(
      'view'
    )
  })

  test('Blog list tests, step2 : url and number of likes are shown when view button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'www.test.com'
    )

    expect(component.container).toHaveTextContent(
      '0'
    )

    expect(component.container).toHaveTextContent(
      'Testuser'
    )

    expect(component.container).toHaveTextContent(
      'hide'
    )
  })

  test('Blog list tests, step3 : like button is clicked twice, event handler is called twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})