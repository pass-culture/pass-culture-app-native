import { axiosInstancePCM } from 'api/axios/axiosInstancePCM'
import { useState } from 'react'

const useTravelOptions = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async (url, params) => {
    try {
      setLoading(true)
      let response
      if (Object.keys(params).length) {
        response = await axiosInstancePCM.get(url, { params })
      }
      setData(response.data)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  return { data, error, loading, fetchData }
}
export default useTravelOptions
