// See https://geo.api.gouv.fr/adresse for more info

export interface Properties {
  label: string
  score: number
  housenumber: string
  id: string
  type: 'locality' | 'municipality' | 'housenumber' | 'street'
  name: string
  postcode: string
  citycode: string
  x: number
  y: number
  city: string
  context: string
  importance: number
  street: string
}

export interface SuggestedPlace {
  name: {
    long: string
    short: string
  }
  extraData: {
    city: string
    department: string
  }
  geolocation: {
    longitude: number | ''
    latitude: number | ''
  }
}
