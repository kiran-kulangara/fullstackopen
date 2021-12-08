import React from 'react'
import Country from './Country.js'

const CountryWithButton = ({country, handleFilterChange}) => {
    return (
        <div>
            {country.name} 
            <button value={country.name} onClick={handleFilterChange}>show</button>
        </div>
    )
}

const CountriesList = ({countriesToShow, handleFilterChange}) => {

    if ( countriesToShow.length >= 10 ) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countriesToShow.length === 1) {
        return (
            <>
                <Country country={countriesToShow[0]}/>
            </>
        )
    } else {
        return (
            <>
                {countriesToShow.map((country) => 
                    <CountryWithButton key={country.name} country={country} handleFilterChange={handleFilterChange} />
                )}
            </>
        )
    }
    
}

export default CountriesList