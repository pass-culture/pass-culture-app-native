import { queryOptions } from '@tanstack/react-query'

interface IGNAddressProperties {
  type: 'housenumber' | 'street' | 'locality' | 'municipality'
  name: string
  label: string
  street: string
  postcode: string
  citycode: string
  city: string
  oldcitycode: string | null
  oldcity: string | null
  context: string
  importance: number
  housenumber: string | null
  id: string
  banId: string | null
  x: number
  y: number
  distance: number
  score: number
}

interface IGNFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: IGNAddressProperties
}

interface IGNReverseResponse {
  type: 'FeatureCollection'
  features: IGNFeature[]
  total?: number
}

export const addressFromCoordsQueryOptions = (lat: number, long: number) =>
  queryOptions({
    queryKey: ['address-from-coords', lat, long] as const,
    queryFn: async () => {
      const url = `https://data.geopf.fr/geocodage/reverse?lon=${long}&lat=${lat}`
      const response = await fetch(url)
      const data: IGNReverseResponse = await response.json()
      return data.features[0]?.properties ?? null
    },
  })
