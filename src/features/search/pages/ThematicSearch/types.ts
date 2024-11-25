import { AlgoliaHit } from 'libs/algolia/types'

export type ThematicSearchPlaylistData = {
  title: string
  offers: { hits: AlgoliaHit[] }
}
