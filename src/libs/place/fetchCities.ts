import { CitiesResponse } from 'libs/place'

export const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

export const fetchCities = async (postalCode: string): Promise<CitiesResponse> => {
  const queryParams = new URLSearchParams()
  queryParams.append('codePostal', postalCode)
  const url = `${CITIES_API_URL}?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch cities')
    return await response.json()
  } catch (_error) {
    return []
  }
}
