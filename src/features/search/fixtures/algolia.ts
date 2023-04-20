import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { env } from 'libs/environment'

export const mockSuggestionHits = [
  {
    objectID: '1',
    query: 'cinéma',
    _highlightResult: {
      query: {
        value: '<mark>cinéma</mark>',
        matchLevel: 'full',
        fullyHighlighted: true,
        matchedWords: ['cinéma'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
  {
    objectID: '2',
    query: 'cinéma itinérant',
    _highlightResult: {
      query: {
        value: '<mark>cinéma</mark> itinérant',
        matchLevel: 'full',
        fullyHighlighted: false,
        matchedWords: ['cinéma'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
]
