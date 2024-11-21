import { AlgoliaHit } from 'libs/algolia/types'
import { Position } from 'libs/location'

export type ThematicSearchPlaylistData = {
  title: string
  offers: { hits: AlgoliaHit[] }
}

export type FetchThematicSearchOffers = {
  userLocation?: Position
}
