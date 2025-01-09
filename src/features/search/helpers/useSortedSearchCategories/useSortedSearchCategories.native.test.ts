import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import {
  categoriesSortPredicate,
  MappingOutput,
  useSortedSearchCategories,
} from './useSortedSearchCategories'

jest.mock('libs/subcategories/useSubcategories')

describe('useSortedSearchCategories', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return all categories', () => {
    const { result } = renderHook(useSortedSearchCategories)

    expect(result.current).toHaveLength(13)
  })

  it("should format category's label", () => {
    const { result } = renderHook(useSortedSearchCategories)

    expect(result.current[0]?.label).toEqual('Concerts & festivals')
  })

  it('should sort search group names by the key position', () => {
    const { result } = renderHook(useSortedSearchCategories)

    const actualCategoriesLabels = result.current.map((category) => category.label)

    expect(actualCategoriesLabels).toEqual([
      'Concerts & festivals',
      'Cinéma',
      'Films, séries et documentaires',
      'Livres',
      'Musique',
      'Arts & loisirs créatifs',
      'Spectacles',
      'Musées & visites culturelles',
      'Jeux & jeux vidéos',
      'Médias & presse',
      'Cartes jeunes',
      'Conférences & rencontres',
      'Évènements en ligne',
    ])
  })

  describe('Category does not have ThematicSearch', () => {
    it('should navigate to search results with search param when a category is selected', async () => {
      const { result } = renderHook(useSortedSearchCategories)

      expect(result.current[0]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFromHistory: undefined,
            isFullyDigitalOffersCategory: undefined,
            offerCategories: ['CONCERTS_FESTIVALS'],
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerSubcategories: [],
            searchId: 'testUuidV4',
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })

    it('should navigate to search results with isFullyDigitalOffersCategory param when category selected is only online platform', async () => {
      const { result } = renderHook(useSortedSearchCategories)

      expect(result.current[12]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFromHistory: undefined,
            isFullyDigitalOffersCategory: true,
            offerCategories: ['EVENEMENTS_EN_LIGNE'],
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerSubcategories: [],
            searchId: 'testUuidV4',
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })
  })

  describe('Category has a ThematicSearch', () => {
    it('should navigate to ThematicSearch when FF on', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1])
      const { result } = renderHook(useSortedSearchCategories)

      expect(result.current[3]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFromHistory: undefined,
            isFullyDigitalOffersCategory: undefined,
            offerCategories: ['LIVRES'],
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerSubcategories: [],
            searchId: 'testUuidV4',
          },
          screen: 'ThematicSearch',
        },
        screen: 'SearchStackNavigator',
      })
    })

    it('should navigate to SearchResult when FF off', () => {
      setFeatureFlags()
      const { result } = renderHook(useSortedSearchCategories)

      expect(result.current[3]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFromHistory: undefined,
            isFullyDigitalOffersCategory: undefined,
            offerCategories: ['LIVRES'],
            offerGenreTypes: undefined,
            offerNativeCategories: undefined,
            offerSubcategories: [],
            searchId: 'testUuidV4',
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })
  })
})

describe('categoriesSortPredicate', () => {
  it('should sort when example is simple', () => {
    const itemA = { position: 2, label: 'Example 1' } as MappingOutput
    const itemB = { position: 1, label: 'Example 2' } as MappingOutput

    expect(categoriesSortPredicate(itemA, itemB)).toEqual(1)
    expect(categoriesSortPredicate(itemB, itemA)).toEqual(-1)
  })

  it('should sort when undefined', () => {
    const itemA = { position: undefined, label: 'Example 1' } as MappingOutput
    const itemB = { position: 1, label: 'Example 2' } as MappingOutput

    expect(categoriesSortPredicate(itemA, itemB)).toEqual(-1)
    expect(categoriesSortPredicate(itemB, itemA)).toEqual(1)
  })
})
