import { useState, useEffect  } from "react"
import axios from "axios"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v2/name/${name}?fullText=true`)
      .then(response => {
        console.log("getting data")
        console.log(response);
        if ((response.data.constructor !== Array) && (response.data.status === 404)) {
          setCountry({found: false})
        } else {
        setCountry({found: true, ...response.data[0]})
        }
      })
      .catch(exception => {
        if (exception.response.status === 404) {
          setCountry({found: false})
        }
      })
  }, [name])

  return country
}

