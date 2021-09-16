import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { AppSearchFields, FALSE } from 'libs/search/filters/constants'

import { buildFacetFilters } from '../buildFacetFilters'

const baseParams: Partial<SearchState> = {
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  locationFilter: { locationType: LocationType.EVERYWHERE },
}

const educationalFilter = {
  [AppSearchFields.is_educational]: FALSE,
}

describe('buildFacetFilters', () => {
  describe('categories', () => {
    it('should fetch with no facetFilters parameter when no category is provided except educational', () => {
      const offerCategories: string[] = []
      const filters = buildFacetFilters({ ...baseParams, offerCategories } as SearchState)
      expect(filters).toStrictEqual([educationalFilter])
    })

    it('should fetch with facetFilters parameter when one category is provided', () => {
      const offerCategories: string[] = ['LECON']
      const filters = buildFacetFilters({ ...baseParams, offerCategories } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.category]: ['LECON'] }, educationalFilter])
    })

    it('should fetch with facetFilters parameter when multiple categories are provided', () => {
      const offerCategories: string[] = ['SPECTACLE', 'LIVRE']
      const filters = buildFacetFilters({ ...baseParams, offerCategories } as SearchState)
      expect(filters).toStrictEqual([
        { [AppSearchFields.category]: ['SPECTACLE', 'LIVRE'] },
        educationalFilter,
      ])
    })
  })

  describe('offer types', () => {
    it('should fetch with no facetFilters when no offer type is provided except educational', () => {
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: false,
      }
      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([educationalFilter])
    })

    it('should fetch with facetFilters when offer is digital', () => {
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: false,
      }
      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.is_digital]: 1 }, educationalFilter])
    })

    it('should fetch with facetFilters when offer is physical only', () => {
      const offerTypes = {
        isDigital: false,
        isEvent: false,
        isThing: true,
      }
      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([
        { [AppSearchFields.is_digital]: 0 },
        { [AppSearchFields.is_thing]: 1 },
        educationalFilter,
      ])
    })

    it('should fetch with facetFilters when offer is event only', () => {
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: false,
      }

      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.is_event]: 1 }, educationalFilter])
    })

    it('should fetch with facetFilters when offer is digital and physical', () => {
      const offerTypes = {
        isDigital: true,
        isEvent: false,
        isThing: true,
      }

      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.is_thing]: 1 }, educationalFilter])
    })

    it('should fetch with facetFilters when offer is digital or an event', () => {
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: false,
      }

      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([
        { any: [{ [AppSearchFields.is_digital]: 1 }, { [AppSearchFields.is_event]: 1 }] },
        educationalFilter,
      ])
    })

    it('should fetch with facetFilters when offer is physical or an event', () => {
      const offerTypes = {
        isDigital: false,
        isEvent: true,
        isThing: true,
      }

      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.is_digital]: 0 }, educationalFilter])
    })

    it('should fetch with no facetFilters when offer is digital, event and thing except educational', () => {
      const offerTypes = {
        isDigital: true,
        isEvent: true,
        isThing: true,
      }

      const filters = buildFacetFilters({ ...baseParams, offerTypes } as SearchState)
      expect(filters).toStrictEqual([educationalFilter])
    })
  })

  describe('offer duo', () => {
    it('should fetch with no facetFilters when offer duo is false except educational', () => {
      const filters = buildFacetFilters({ ...baseParams, offerIsDuo: false } as SearchState)
      expect(filters).toStrictEqual([educationalFilter])
    })

    it('should fetch with facetFilters when offer duo is true', () => {
      const filters = buildFacetFilters({ ...baseParams, offerIsDuo: true } as SearchState)
      expect(filters).toStrictEqual([{ [AppSearchFields.is_duo]: 1 }, educationalFilter])
    })
  })

  describe('tags', () => {
    it('should fetch with no facetFilters parameter when no tags are provided except educational', () => {
      const tags: string[] = []
      const filters = buildFacetFilters({ ...baseParams, tags } as SearchState)
      expect(filters).toStrictEqual([educationalFilter])
    })

    it('should fetch with facetFilters parameter when tags are provided', () => {
      const tags: string[] = ['Semaine du 14 juillet', 'Offre cinema spéciale pass culture']
      const filters = buildFacetFilters({ ...baseParams, tags } as SearchState)
      expect(filters).toStrictEqual([
        { [AppSearchFields.tags]: ['Semaine du 14 juillet', 'Offre cinema spéciale pass culture'] },
        educationalFilter,
      ])
    })
  })
})
