import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getSearchVenueQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getSearchVenueQuery'
import { searchQueryParametersFixture } from 'libs/algolia/fixtures/searchQueryParametersFixture'

describe('getVenuesQuery', () => {
  describe('When query is empty string', () => {
    it('should return the native category when category and native category are not empty', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(NativeCategoryIdEnumv2.LIVRES_PAPIER)
    })

    it('should return the native category when native category is not empty', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(NativeCategoryIdEnumv2.LIVRES_PAPIER)
    })

    it('should return the category when category is not empty', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(SearchGroupNameEnumv2.LIVRES)
    })

    it('should return an empty string when category and native category are empty', () => {
      const parameters = {
        ...searchQueryParametersFixture,
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual('')
    })
  })

  describe('When query is not an empty string', () => {
    it('should only return the native category when the user selected a category + a native category and typed a query', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(NativeCategoryIdEnumv2.LIVRES_PAPIER)
    })

    it('should only return the native category when the user selected one and typed a query', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(NativeCategoryIdEnumv2.LIVRES_PAPIER)
    })

    it('should only return the category when the user selected one and typed a query', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual(`${SearchGroupNameEnumv2.LIVRES}`)
    })

    it('should return the query when the user did not select either a category or a native category', () => {
      const parameters = {
        ...searchQueryParametersFixture,
        offerCategories: [],
        offerNativeCategories: [],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)

      expect(venuesQuery).toEqual('fnac')
    })
  })
})
