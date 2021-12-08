import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountriesList from './components/CountriesList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [ newFilter, setNewFilter ] = useState('')

  const countriesToShow = (newFilter !== '')  ? countries.filter((country)=> country.name.toLowerCase().includes(newFilter.toLowerCase())) 
                                              : countries

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        console.log("getting data")
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <CountriesList countriesToShow={countriesToShow} handleFilterChange={handleFilterChange}/>
    </div>
  )
}

export default App;
