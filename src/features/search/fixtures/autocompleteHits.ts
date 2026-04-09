import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

export const mockHit = {
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
  __position: 123,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        ['offer.searchGroups']: [],
        ['offer.nativeCategoryId']: [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.CINEMA,
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
} as AlgoliaSuggestionHit

export const mockHitSeveralCategoriesWithAssociationToNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.ARTS_VISUELS,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitSeveralCategoriesWithAssociationToBooksNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.LIVRES,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.LIVRES_PAPIER,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitSeveralCategoriesWithoutAssociationToNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: NativeCategoryIdEnumv2.RENCONTRES_EN_LIGNE,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitWithoutCategoryAndNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitWithOnlyCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitUnknownNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.MUSIQUE,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: 'CD_VINYLES' as NativeCategoryIdEnumv2,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitUnknownCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: 'undefined' as SearchGroupNameEnumv2,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitUnknownNativeCategoryAndCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: '',
            operator: '',
            value: 'undefined' as SearchGroupNameEnumv2,
            count: 10,
          },
        ],
        ['offer.nativeCategoryId']: [
          {
            attribute: '',
            operator: '',
            value: 'CD_VINYLES' as NativeCategoryIdEnumv2,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitIrrelevantResult: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 207894,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        'offer.nativeCategoryId': [
          {
            attribute: 'offer.nativeCategoryId',
            operator: ':',
            value: NativeCategoryIdEnumv2.MATERIELS_CREATIFS,
            count: 250,
          },
        ],
        'offer.searchGroups': [
          {
            attribute: 'offer.searchGroups',
            operator: ':',
            value: SearchGroupNameEnumv2.LIVRES,
            count: 3153,
          },
        ],
      },
    },
  },
}

export const mockHitRelevantResults: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2627,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        'offer.nativeCategoryId': [
          {
            attribute: 'offer.nativeCategoryId',
            operator: ':',
            value: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
            count: 8,
          },
        ],
        'offer.searchGroups': [
          {
            attribute: 'offer.searchGroups',
            operator: ':',
            value: SearchGroupNameEnumv2.LIVRES,
            count: 6172,
          },
        ],
      },
    },
  },
}

export const mockHitsWithDifferentCounts: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2627,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        'offer.nativeCategoryId': [
          {
            attribute: 'offer.nativeCategoryId',
            operator: ':',
            value: NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
            count: 8,
          },
          {
            attribute: 'offer.nativeCategoryId',
            operator: ':',
            value: NativeCategoryIdEnumv2.BIBLIOTHEQUE_MEDIATHEQUE,
            count: 13,
          },
        ],
        'offer.searchGroups': [
          {
            attribute: 'offer.searchGroups',
            operator: ':',
            value: SearchGroupNameEnumv2.LIVRES,
            count: 6172,
          },
        ],
      },
    },
  },
}

export const mockHitWithUnavailableCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: 'offer.searchGroups',
            operator: ':',
            value: SearchGroupNameEnumv2.NONE,
            count: 6172,
          },
        ],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitWithNativeCategory: AlgoliaSuggestionHit = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      exact_matches: {
        'offer.nativeCategoryId': [],
        'offer.searchGroups': [],
      },
      analytics: {
        ['offer.searchGroups']: [
          {
            attribute: 'offer.searchGroups',
            operator: ':',
            value: SearchGroupNameEnumv2.LIVRES,
            count: 6172,
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
}
