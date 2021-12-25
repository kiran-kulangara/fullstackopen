import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
  return(
    <>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({filter,anecdotes}) => {

    return (filter !== '')  ? anecdotes.filter((anecdote)=> anecdote.content.toLowerCase().includes(filter.toLowerCase()))
                              :anecdotes
  })  

  return(
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => {
            dispatch(addVote(anecdote))
            dispatch(addNotification(`you voted '${anecdote.content}'`, 5))
          }}
        />
      )}
    </div>
  )
}

export default AnecdoteList