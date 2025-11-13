import { CitiesResponse } from 'libs/place/types'

const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

export const fetchCitiesByName = async (name: string): Promise<CitiesResponse> => {
  const queryParams = new URLSearchParams()
  queryParams.append('nom', name)
  queryParams.append('limit', '10')
  queryParams.append('boost', 'population') // sort results by biggest cities in terms of population
  const url = `${CITIES_API_URL}?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch cities')
    return await response.json()
  } catch (_error) {
    return []
  }
}
