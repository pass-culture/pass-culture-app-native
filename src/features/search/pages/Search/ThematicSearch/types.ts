import { Offer } from 'shared/offer/types'

export type ThematicSearchPlaylistData = {
  title: string
  offers: { hits: Offer[] }
}
