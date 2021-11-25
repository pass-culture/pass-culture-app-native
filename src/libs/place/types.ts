import { FeatureCollection, Point } from 'geojson'

// See https://geo.api.gouv.fr/adresse for more info

export interface Properties {
  label: string
  score: number
  housenumber?: string
  id: string
  type: 'locality' | 'municipality' | 'housenumber' | 'street'
  name: string
  postcode: string
  citycode: string
  x: number
  y: number
  population?: number
  city: string
  context: string
  importance: number
  street?: string
}

export interface SuggestedPlace {
  label: string
  info: string
  geolocation: {
    longitude: number
    latitude: number
  } | null
}
export interface SuggestedCity {
  name: string
  code: string
  postalCode: string
}

export type Collection = FeatureCollection<Point, Properties>
