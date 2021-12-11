import React from "react";
import Contact from './Contact'
import * as ContactService from "../services/ContactService";


const Persons = ({persons, personsToShow, handleDeleteContact, handleNotifcation}) => {

    const deleteContact = ({id, name}) => {
                
        ContactService.deleteContact(id)
        .then(() => {
            handleDeleteContact(persons.filter(person => person.id !== id))
            handleNotifcation({
                message: `Removed ${name} from the server`,
                isSuccess: true
            })
        })
        .catch(error => {
            handleNotifcation({
                message: `Information of ${name} has already been removed from the server`,
                isSuccess: false
            })
            handleDeleteContact(persons.filter(person => person.id !== id))
        })
    }
    return (
        <>
        {personsToShow.map(person => 
            <Contact key={person.name} contact={person} deleteContact={deleteContact}/>
        )}
      </>
    )
}

export default Persons

