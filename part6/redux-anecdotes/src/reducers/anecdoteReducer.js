import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'ADD_VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(n => {
        return n.id === id
      
      })
      console.log(anecdoteToChange)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes+1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      ).sort((a, b) => b.votes - a.votes)
    case 'INIT_ANECDOTE':
      return action.data.sort((a, b) => b.votes - a.votes)
    default:
      return state
  }
}

export const addVote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.addVote(anecdote)
    dispatch({
      type: 'ADD_VOTE',
      data: {id: anecdote.id}
    })
  }
}

export const createAnecdote = (data) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew({ content: data, votes: 0})
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTE',
      data: anecdotes,
    })
  }
}

export default anecdoteReducer