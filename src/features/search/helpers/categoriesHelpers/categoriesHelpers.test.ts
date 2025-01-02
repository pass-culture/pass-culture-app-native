import {
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import {
  ALL,
  CategoryResponseModel,
  getCategoriesMapping,
  getNativeCategoryFromEnum,
  getNbResultsFacetLabel,
  isOnlyOnline,
  ROOT,
  ROOT_ALL,
  sortCategoriesPredicate,
  useSubcategoryIdsFromSearchGroups,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

let mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('categoriesHelpers', () => {
  describe('getCategoriesMapping', () => {
    it('should build minimal structure', () => {
      const categories: CategoryResponseModel[] = []
      const expectedMapping = {
        [ROOT.key]: {
          children: [ROOT_ALL.key],
          label: 'Catégories',
          key: 'ROOT',
          position: -Infinity,
        },
        [ROOT_ALL.key]: {
          children: [],
          label: ALL_CATEGORIES_LABEL,
          key: 'NONE',
          position: -Infinity,
        },
        [ALL.key]: {
          children: [],
          label: 'Tout',
          key: 'ALL',
          position: -Infinity,
        },
      }

      expect(getCategoriesMapping(categories)).toEqual(expectedMapping)
    })

    it('should handle multiple parents', () => {
      const categories: CategoryResponseModel[] = [
        { key: 'CINEMA', label: 'Cinéma', children: ['THRILLER'] },
        { key: 'LIVRES', label: 'Livres', children: ['THRILLER'] },
      ]
      const expectedMapping = {
        [ROOT.key]: {
          children: [ROOT_ALL.key, 'CINEMA', 'LIVRES'],
          label: 'Catégories',
          key: 'ROOT',
          position: -Infinity,
        },
        [ROOT_ALL.key]: {
          children: [],
          label: ALL_CATEGORIES_LABEL,
          key: 'NONE',
          position: -Infinity,
        },
        [ALL.key]: {
          children: [],
          label: 'Tout',
          key: 'ALL',
          position: -Infinity,
        },
        CINEMA: {
          key: 'CINEMA',
          label: 'Cinéma',
          children: ['ALL', 'THRILLER'],
        },
        LIVRES: {
          key: 'LIVRES',
          label: 'Livres',
          children: ['ALL', 'THRILLER'],
        },
      }

      expect(getCategoriesMapping(categories)).toEqual(expectedMapping)
    })

    it('should not have ALL as only child', () => {
      const categories: CategoryResponseModel[] = [{ key: 'CINEMA', label: 'Cinéma', children: [] }]
      const expectedMapping = {
        [ROOT.key]: {
          children: [ROOT_ALL.key, 'CINEMA'],
          label: 'Catégories',
          key: 'ROOT',
          position: -Infinity,
        },
        [ROOT_ALL.key]: {
          children: [],
          label: ALL_CATEGORIES_LABEL,
          key: 'NONE',
          position: -Infinity,
        },
        [ALL.key]: {
          children: [],
          label: 'Tout',
          key: 'ALL',
          position: -Infinity,
        },
        CINEMA: {
          key: 'CINEMA',
          label: 'Cinéma',
          children: [],
        },
      }
      expect(getCategoriesMapping(categories)).toEqual(expectedMapping)
    })

    it('should be idempotent', () => {
      const categories: CategoryResponseModel[] = [
        { key: 'CINEMA', label: 'Cinéma', children: ['THRILLER'] },
        { key: 'LIVRES', label: 'Livres', children: ['THRILLER'] },
      ]
      const expectedMapping = {
        [ROOT.key]: {
          children: [ROOT_ALL.key, 'CINEMA', 'LIVRES'],
          label: 'Catégories',
          key: 'ROOT',
          position: -Infinity,
        },
        [ROOT_ALL.key]: {
          children: [],
          label: ALL_CATEGORIES_LABEL,
          key: 'NONE',
          position: -Infinity,
        },
        [ALL.key]: {
          children: [],
          label: 'Tout',
          key: 'ALL',
          position: -Infinity,
        },
        CINEMA: {
          key: 'CINEMA',
          label: 'Cinéma',
          children: ['ALL', 'THRILLER'],
        },
        LIVRES: {
          key: 'LIVRES',
          label: 'Livres',
          children: ['ALL', 'THRILLER'],
        },
      }

      getCategoriesMapping(categories)
      expect(getCategoriesMapping(categories)).toEqual(expectedMapping)
    })
  })
  describe('isOnlyOnline', () => {
    it('should return false when category and native category are undefined', () => {
      const value = isOnlyOnline([])

      expect(value).toEqual(false)
    })

    describe('Category', () => {
      it('should return true when all native categories of the category are online platform', () => {
        const value = isOnlyOnline([SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE])

        expect(value).toEqual(true)
      })

      it('should return false when all native categories of the category are offline', () => {
        const value = isOnlyOnline([SearchGroupNameEnumv2.LIVRES])

        expect(value).toEqual(false)
      })

      it('should return false when native categories of the category are online and offline platform', () => {
        const value = isOnlyOnline([SearchGroupNameEnumv2.SPECTACLES])

        expect(value).toEqual(false)
      })

      it('should return false when native categories of the category are online, offline and online or offline platform', () => {
        const value = isOnlyOnline([SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS])

        expect(value).toEqual(false)
      })
    })

    describe('Native category', () => {
      it('should return true when all pro subcategories of the native category are online platform', () => {
        const value = isOnlyOnline([NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE])

        expect(value).toEqual(true)
      })

      it('should return false when all pro subcategories of the native category are offline', () => {
        const value = isOnlyOnline([NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT])

        expect(value).toEqual(false)
      })

      it('should return false when pro subcategories of the native category are online and offline platform', () => {
        const value = isOnlyOnline([NativeCategoryIdEnumv2.VISITES_CULTURELLES])

        expect(value).toEqual(false)
      })

      it('should return false when pro subcategories of the native category are offline and online or offline platform', () => {
        const value = isOnlyOnline([NativeCategoryIdEnumv2.ARTS_VISUELS])

        expect(value).toEqual(false)
      })
    })
  })

  describe('getNativeCategoryFromEnum', () => {
    it('should return undefined when subcategories API return undefined data', () => {
      const value = getNativeCategoryFromEnum(undefined, NativeCategoryIdEnumv2.ARTS_VISUELS)

      expect(value).toEqual(undefined)
    })

    it('should return undefined when native category id is undefined', () => {
      const value = getNativeCategoryFromEnum(PLACEHOLDER_DATA, undefined)

      expect(value).toEqual(undefined)
    })

    it('should return the native category from native category id', () => {
      const value = getNativeCategoryFromEnum(PLACEHOLDER_DATA, NativeCategoryIdEnumv2.ARTS_VISUELS)

      expect(value).toEqual({
        genreType: null,
        parents: ['ARTS_LOISIRS_CREATIFS'],
        name: 'ARTS_VISUELS',
        value: 'Arts visuels',
      })
    })
  })

  describe('getNbResultsFacetLabel', () => {
    it('should display "+10000" when the number of result facets is greater than 10000', () => {
      const result = getNbResultsFacetLabel(10001)

      expect(result).toEqual('+10000')
    })

    it('should display the exact number of result facets is less than 10000', () => {
      const result = getNbResultsFacetLabel(5)

      expect(result).toEqual('5')
    })

    it('should display "0" when the number of result facets is equal to 0', () => {
      const result = getNbResultsFacetLabel(0)

      expect(result).toEqual('0')
    })

    it('should return undefined when the number of result facets is undefined', () => {
      const result = getNbResultsFacetLabel()

      expect(result).toEqual(undefined)
    })
  })

  describe('useSubcategoryIdsFromSearchGroup', () => {
    it('should return subcategories of one given searchGroup', () => {
      const searchGroups = [SearchGroupNameEnumv2.LIVRES]

      const { result } = renderHook(() => useSubcategoryIdsFromSearchGroups(searchGroups), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(result.current).toEqual([
        'ABO_BIBLIOTHEQUE',
        'ABO_LIVRE_NUMERIQUE',
        'ABO_MEDIATHEQUE',
        'FESTIVAL_LIVRE',
        'LIVRE_AUDIO_PHYSIQUE',
        'LIVRE_NUMERIQUE',
        'LIVRE_PAPIER',
        'TELECHARGEMENT_LIVRE_AUDIO',
      ])
    })

    it('should return subcategories of several given searchGroups', () => {
      const searchGroups = [SearchGroupNameEnumv2.CINEMA, SearchGroupNameEnumv2.LIVRES]

      const { result } = renderHook(() => useSubcategoryIdsFromSearchGroups(searchGroups), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(result.current).toEqual(
        expect.arrayContaining([
          'CARTE_CINE_ILLIMITE',
          'CARTE_CINE_MULTISEANCES',
          'CINE_PLEIN_AIR',
          'CINE_VENTE_DISTANCE',
          'EVENEMENT_CINE',
          'FESTIVAL_CINE',
          'SEANCE_CINE',
          'ABO_BIBLIOTHEQUE',
          'ABO_LIVRE_NUMERIQUE',
          'ABO_MEDIATHEQUE',
          'FESTIVAL_LIVRE',
          'LIVRE_AUDIO_PHYSIQUE',
          'LIVRE_NUMERIQUE',
          'LIVRE_PAPIER',
          'TELECHARGEMENT_LIVRE_AUDIO',
        ])
      )
    })

    it('should return empty array when no searchgroup is provided', () => {
      const { result } = renderHook(() => useSubcategoryIdsFromSearchGroups([]), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(result.current).toEqual([])
    })

    it('should return empty array when useSubcategories returns no data', () => {
      const searchGroups = [SearchGroupNameEnumv2.CINEMA, SearchGroupNameEnumv2.LIVRES]

      mockData = undefined

      const { result } = renderHook(() => useSubcategoryIdsFromSearchGroups(searchGroups), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(result.current).toEqual([])
    })
  })

  describe('sortCategoriesPredicate', () => {
    it('should sort following position ascending order', () => {
      const lowestPosition = { label: 'a', position: 0, key: 'a', children: [] }
      const greatestPosition = { label: 'b', position: 1, key: 'b', children: [] }

      expect(
        [greatestPosition, lowestPosition].sort((a, b) => sortCategoriesPredicate(a, b))
      ).toEqual([lowestPosition, greatestPosition])
    })

    it('should prioritize position over label', () => {
      const withoutPosition = { label: 'a', key: 'a', children: [] }
      const withPosition = { label: 'b', position: 1, key: 'b', children: [] }

      expect([withoutPosition, withPosition].sort((a, b) => sortCategoriesPredicate(a, b))).toEqual(
        [withPosition, withoutPosition]
      )
    })

    it('should sort following label alphabetical ascending order if no positions', () => {
      const firstLabel = { label: 'a', key: 'a', children: [] }
      const lastLabel = { label: 'b', key: 'b', children: [] }

      expect([lastLabel, firstLabel].sort((a, b) => sortCategoriesPredicate(a, b))).toEqual([
        firstLabel,
        lastLabel,
      ])
    })

    it('should sort following labels if positions are equal', () => {
      const firstLabel = { label: 'a', position: 1, key: 'a', children: [] }
      const lastLabel = { label: 'b', position: 1, key: 'b', children: [] }

      expect([lastLabel, firstLabel].sort((a, b) => sortCategoriesPredicate(a, b))).toEqual([
        firstLabel,
        lastLabel,
      ])
    })
  })
})
