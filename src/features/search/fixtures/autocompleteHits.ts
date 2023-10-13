import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'

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
} as AlgoliaSuggestionHit

export const mockHitSeveralCategoriesWithAssociationToNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
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

export const mockHitSeveralCategoriesWithoutAssociationToNativeCategory = {
  ...mockHit,
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
            value: NativeCategoryIdEnumv2.ARTS_VISUELS,
            count: 10,
          },
        ],
      },
    },
  },
}

export const mockHitWithoutCategoryAndNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [],
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitWithOnlyCategory = {
  ...mockHit,
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
        ['offer.nativeCategoryId']: [],
      },
    },
  },
}

export const mockHitUnknownNativeCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
          {
            attribute: '',
            operator: '',
            value: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
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

export const mockHitUnknownCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
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

export const mockHitUnknownNativeCategoryAndCategory = {
  ...mockHit,
  [env.ALGOLIA_OFFERS_INDEX_NAME]: {
    exact_nb_hits: 2,
    facets: {
      analytics: {
        ['offer.searchGroupNamev2']: [
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
