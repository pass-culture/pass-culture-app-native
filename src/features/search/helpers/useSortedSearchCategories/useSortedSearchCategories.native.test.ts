import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import {
  categoriesSortPredicate,
  MappingOutput,
  useSortedSearchCategories,
} from './useSortedSearchCategories'

jest.mock('libs/subcategories/useSubcategories')

const mockUseSearch = jest.fn(() => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

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
            isFullyDigitalOffersCategory: false,
            offerCategories: ['CONCERTS_FESTIVALS'],
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
            isFullyDigitalOffersCategory: true,
            offerCategories: ['EVENEMENTS_EN_LIGNE'],
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
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS])
      const { result } = renderHook(useSortedSearchCategories)

      expect(result.current[0]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFullyDigitalOffersCategory: false,
            offerCategories: ['CONCERTS_FESTIVALS'],
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

      expect(result.current[0]?.navigateTo.params).toEqual({
        params: {
          params: {
            isFullyDigitalOffersCategory: false,
            offerCategories: ['CONCERTS_FESTIVALS'],
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
