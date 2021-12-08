import React from 'react'

const Contact = ({contact, deleteContact}) => {
  
  const confirmDeletion = () => {  
    if (window.confirm(`Delete ${contact.name} ?`)) {
      deleteContact(contact);
    } 
  }
  return (
    <div>
      {contact.name} {contact.number}
      <button onClick={() => {confirmDeletion()}}>delete</button>
    </div>
  )
}

export default Contact