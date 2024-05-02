import { SuggestedPlace } from 'libs/place/types'

export const mockPlaces = [
  {
    label: 'Kourou',
    info: 'Guyane',
    type: 'street',
    geolocation: { longitude: -52.669736, latitude: 5.16186 },
  },
] as const satisfies readonly SuggestedPlace[]
