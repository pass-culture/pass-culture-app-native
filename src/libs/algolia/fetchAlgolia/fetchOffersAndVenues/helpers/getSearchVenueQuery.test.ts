import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getSearchVenueQuery } from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/helpers/getSearchVenueQuery'
import { SearchQueryParametersFixture } from 'libs/algolia/fixtures'

describe('getVenuesQuery', () => {
  describe('When query is empty string', () => {
    it('should return the native category when category and native category are not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES_PAPIER')
    })

    it('should return the native category when native category is not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES_PAPIER')
    })

    it('should return the category when category is not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES')
    })

    it('should return an empty string when category and native category are empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('')
    })
  })

  describe('When query is not empty string', () => {
    it('should return the native category when category and native category are not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES_PAPIER fnac')
    })

    it('should return the native category when native category is not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES_PAPIER fnac')
    })

    it('should return the category when category is not empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('LIVRES fnac')
    })

    it('should return an empty string when category and native category are empty', () => {
      const parameters = {
        ...SearchQueryParametersFixture,
        query: 'fnac',
      }
      const venuesQuery = getSearchVenueQuery(parameters)
      expect(venuesQuery).toEqual('fnac')
    })
  })
})
