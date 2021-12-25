let initialState = ''

const notificationReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.data.notification
    case 'CLEAR_NOTIFICATION':
      return initialState
    default:
      return state
  }
} 

export const addNotification = (message, timeInSec) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        notification: `${message}`
      }
    })
    
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeInSec * 1000 )
  }
}

export const removeNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
    data: {
      notification: null
    }
  }
}

export default notificationReducer