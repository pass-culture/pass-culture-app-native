import { api } from 'api/api'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'

export type DirectIdEntityKey = 'offer' | 'venue' | 'artist'

type DirectIdEntity = {
  key: DirectIdEntityKey
  label: string
  idType: 'number' | 'string'
  navigate: (navigation: UseNavigationType, id: string) => void
  validate?: (id: string) => Promise<unknown>
}

export const DIRECT_ID_ENTITIES: Record<DirectIdEntityKey, DirectIdEntity> = {
  offer: {
    key: 'offer',
    label: 'Offre',
    idType: 'number',
    navigate: (navigation, id) =>
      navigation.navigate('Offer', { id: Number(id), from: 'deeplink' }),
    validate: (id) => api.getNativeV3OfferofferId(Number(id)),
  },
  venue: {
    key: 'venue',
    label: 'Lieu',
    idType: 'number',
    navigate: (navigation, id) =>
      navigation.navigate('Venue', { id: Number(id), from: 'deeplink' }),
    validate: (id) => api.getNativeV2VenuevenueId(Number(id)),
  },
  artist: {
    key: 'artist',
    label: 'Artiste',
    idType: 'string',
    navigate: (navigation, id) => navigation.navigate('Artist', { id }),
  },
}

export const DIRECT_ID_ENTITY_KEYS = Object.keys(DIRECT_ID_ENTITIES) as DirectIdEntityKey[]

export const DEFAULT_DIRECT_ID_ENTITY_KEY: DirectIdEntityKey = 'offer'

export const isDirectIdValueValid = (entity: DirectIdEntity, value: string): boolean => {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (entity.idType === 'number') return /^\d+$/.test(trimmed)
  return true
}
