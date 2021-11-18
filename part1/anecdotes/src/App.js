import React, { useState } from 'react'

const Header = (props) => {
  return (
    <>
      <h1>{props.value}</h1>
    </>)
}

const Anecdote = ({text, votes}) => {
  return (
    <>
    <div>{text}</div>
    <div>has {votes} votes</div>
    </>)
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  
  const [selected, setSelected] = useState({
    current: 0,
    votes: new Array(anecdotes.length).fill(0),
    maxVoteIndex: 0
  })
  
  const handleVote = () => {
    const copy = {...selected}
    copy.votes[selected.current] += 1
    let indexOfMaxValue = copy.votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    copy.maxVoteIndex = indexOfMaxValue
    setSelected(copy)
  }

  const handleNext = () => {
    const randNum = Math.floor(Math.random() * anecdotes.length)
    const copy = {...selected}
    copy.current = randNum
    setSelected(copy)
  }

  return (
    <div>
      <Header value="Anecdote of the day" />
      <Anecdote text={anecdotes[selected.current]} votes={selected.votes[selected.current]}/>
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={handleNext} text="next anecdote" />
      <Header value="Anecdote with most votes" />
      <Anecdote text={anecdotes[selected.maxVoteIndex]} votes={selected.votes[selected.maxVoteIndex]}/>
    </div>
  )
}

export default App