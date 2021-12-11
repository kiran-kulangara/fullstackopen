import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import * as ContactService from './services/ContactService'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ notification, setNewNotification ] = useState({message: null, isSuccess:null})

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDeleteContact = (persons) => {
    setPersons(persons)
  }

  const handleNotifcation = (notificationObject) => {
    setNewNotification(notificationObject)
    setTimeout(() => {
      setNewNotification({
        message   : null,
        isSuccess : null
      })
    }, 5000)
  }

  useEffect(() => {
    ContactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const duplicate = persons.find((p)=> p.name === newName)
    const changedContact = { ...duplicate, number: newNumber }

    if (duplicate) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old one with a new one?`)) {
        ContactService
        .update(duplicate.id, changedContact)
        .then(updatedContact => {
          setPersons(persons.map(person => person.id !== duplicate.id ? person : updatedContact))
          setNewName('')
          setNewNumber('')
          handleNotifcation({
            message   : `Updated ${updatedContact.name}'s contact info in the server`,
            isSuccess : true
          })
        })
        .catch(error => {
          console.log(error.response.data)
          handleNotifcation({
              message: `${error.response.data.error}`,
              isSuccess: false
          })
          //handleDeleteContact(persons.filter(person => person.id !== changedContact.id))
        })
      } 
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    ContactService
    .create(personObject)
    .then(newContact => {
      setPersons(persons.concat(newContact))
      setNewName('')
      setNewNumber('')
      handleNotifcation({
        message   : `Added ${personObject.name}`,
        isSuccess : true
      })
    })
    .catch(error => {
      console.log("Kiran",error.response.data)
      handleNotifcation({
        message: `${error.response.data.error}`,
        isSuccess: false
      })
    })
    
  }

  const personsToShow = newFilter ? persons.filter((person)=> person.name.toLowerCase().includes(newFilter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter 
        newFilter={newFilter} 
        handleFilterChange={handleFilterChange}
      />
      <h3>add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson} 
        handleNameChange={handleNameChange}   
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        persons={persons}
        personsToShow={personsToShow} 
        handleDeleteContact={handleDeleteContact}
        handleNotifcation={handleNotifcation}
      />
    </div>
  )
}

export default App
