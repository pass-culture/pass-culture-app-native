import { Geoloc } from 'libs/algolia'
import { Layout } from 'libs/contentful/types'

export interface Venue {
  label: string
  info: string
  venueId: number | null
  _geoloc?: Geoloc
}

export type GTLLevel = 1 | 2 | 3 | 4

export type ContentfulGtlPlaylistResponse = [
  {
    fields: {
      algoliaParameters: {
        fields: {
          hitsPerPage: number
          gtlLevel: GTLLevel
          gtlLabel: string
        }
      }
      displayParameters: {
        fields: {
          minOffers: number
          title: string
          layout: Layout
        }
      }
    }
  }
]
