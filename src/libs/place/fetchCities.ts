export const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

export const fetchCities = (postalCode: string) => {
  const queryParams = new URLSearchParams()
  queryParams.append('codePostal', postalCode)
  const url = `${CITIES_API_URL}?${queryParams.toString()}`

  return fetch(url)
    .then((response) => response.json())
    .catch(() => [])
}
