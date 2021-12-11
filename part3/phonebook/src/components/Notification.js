const Notification = ({ notification }) => {
    if (notification.message === null) {
      return null
    }
  
    if (notification.isSuccess) {
        return (
            <div className="success">
              {notification.message}
            </div>
        )
    } else {
        return (
            <div className="error">
              {notification.message}
            </div>
        )
    }
    
}

export default Notification