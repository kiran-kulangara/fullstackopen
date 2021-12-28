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

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        console.log("getting data")
        console.log(response);
        setResources(response.data)
      })
  }, [baseUrl])

  const create = (resource) => {
    const request = axios.post(baseUrl, resource)
    request.then(response => {
      console.log(response);
      setResources([response.data, ...resources])
    })
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}