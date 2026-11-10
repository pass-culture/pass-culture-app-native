import { AlgoliaOffer } from 'libs/algolia/types'

export type ThematicSearchPlaylistData = {
  id: string
  title: string
  offers: { hits: AlgoliaOffer[] }
}

export type ThematicSearchPlaylistConfig = Pick<ThematicSearchPlaylistData, 'id' | 'title'>
