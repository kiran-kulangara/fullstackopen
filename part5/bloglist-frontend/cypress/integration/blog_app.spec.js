describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'tester',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      cy.contains('Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Tester logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('A blog created by cypress')
      cy.get('#author').type('Tester')
      cy.get('#url').type('cypress.com')
      cy.get('#create-button').click()
      cy.contains('A blog created by cypress')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'test' })
    })

    describe('adding multiple blogs', function () {
      beforeEach(function(){
        cy.createBlog({ title: 'One', author: 'AuthorOne', url: 'www.one.com' })
        cy.createBlog({ title: 'Two', author: 'AuthorTwo', url: 'www.two.com' })
        cy.createBlog({ title: 'Three', author: 'AuthorThree', url: 'www.three.com' })
      })

      it('viewing and liking one blog', function () {
        cy.contains('view').parent().find('button').as('theViewButton')
        cy.get('@theViewButton').click()
        cy.get('@theViewButton').should('contain', 'hide')

        cy.contains('like').parent().find('button').as('theLikeButton')
        cy.get('@theLikeButton').click()
        cy.get('@theLikeButton').click()
        cy.contains('likes 2')
      })

    })
  })

  describe('only user who created a blog can delete it', function () {
    beforeEach(function(){
      cy.createUser({ name: 'Tester2', username: 'tester2', password:'test2' })
      cy.login({ username: 'tester', password: 'test' })
      cy.createBlog({ title: 'One', author: 'AuthorOne', url: 'www.one.com' })
    })

    it('deletion by creator', function () {
      cy.contains('One')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'One')
    })

    it('other users cannot delete the blog', function () {
      cy.contains('logout').click()
      cy.login({ username: 'tester2', password: 'test2' })

      cy.contains('One')
      cy.contains('view').click()
      cy.get('#creatorName').should('not.contain', 'remove')
    })

  })

  describe('the blogs are ordered according to likes', function () {
    beforeEach(function () {
      cy.login({ username: 'tester', password: 'test' })
      cy.createBlogWithLikes({
        title: 'One',
        author: 'AuthorOne',
        url: 'url1.com',
        likes: 10,
      })
      cy.createBlogWithLikes({
        title: 'Two',
        author: 'AuthorTwo',
        url: 'url2.com',
        likes: 20,
      })
      cy.createBlogWithLikes({
        title: 'Three',
        author: 'AuthorThree',
        url: 'url3.com',
        likes: 30,
      })
    })

    it('blogs are sorted by likes', function () {
      cy.get('.blogList').then((items) => {
        expect(items[0]).to.contain('Three')
        expect(items[1]).to.contain('Two')
        expect(items[2]).to.contain('One')
      })
    })
  })

})
