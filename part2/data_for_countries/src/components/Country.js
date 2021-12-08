import React from 'react'
import Weather from './Weather.js'

const Country = ({ country }) => {
    return (
      <>
        <h2>{country.name}</h2>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h3>Spoken languages</h3>
        <ul>
          {country.languages.map((language) => <li key={language.iso639_2}>{language.name}</li>)}
        </ul>
        <img src={country.flag} alt='flag' width="165"></img>
        
        <Weather capital={country.capital}/>
      </>
    )
}
  
export default Country