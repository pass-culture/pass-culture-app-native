import { MultipleQueriesQuery } from '@algolia/client-search'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { Offer } from 'shared/offer/types'

export const fetchThematicSearchPlaylists = async (queries: MultipleQueriesQuery[]) => {
  try {
    const allQueries = await multipleQueries<Offer>(queries)

    return allQueries.filter(searchResponsePredicate)
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}
