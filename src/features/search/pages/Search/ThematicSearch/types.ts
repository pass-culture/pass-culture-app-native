import { Position } from 'libs/location'
import { Offer } from 'shared/offer/types'

export type ThematicSearchPlaylistData = {
  title: string
  offers: { hits: Offer[] }
}

export type FetchThematicSearchOffers = {
  userLocation?: Position
}
