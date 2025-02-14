import { AlgoliaOffer } from 'libs/algolia/types'

export type ThematicSearchPlaylistData = {
  title: string
  offers: { hits: AlgoliaOffer[] }
}
