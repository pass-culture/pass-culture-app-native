import { Hit, SearchResponse } from 'algoliasearch/lite'

import { AlgoliaArtist } from 'libs/algolia/types'

export type FetchSearchArtistsResponse = {
  artistsResponse:
    | SearchResponse<AlgoliaArtist>
    | {
        hits: Hit<AlgoliaArtist>[]
        nbHits: number
        page: number
        nbPages: number
        userData: null
      }
} | null
