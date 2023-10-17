import { GenreType, SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { buildFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildFacetFilters'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const defaultBuildFacetFilterParam = {
  isUserUnderage: false,
  locationFilter: { locationType: LocationType.EVERYWHERE } as LocationFilter,
  objectIds: [],
  offerCategories: [],
  offerGenreTypes: [],
  offerIsDuo: false,
  offerNativeCategories: [],
  offerSubcategories: [],
  tags: [],
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
}

const place = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('buildFacetFilters', () => {
  it('should return null when offer categories is empty and offer is duo = false', () => {
    // @ts-ignore: Normally impossible but condition present
    const facetFilters = buildFacetFilters({ ...defaultBuildFacetFilterParam, offerTypes: null })
    expect(facetFilters).toEqual(null)
  })

  it('should return isEducational facet by default', () => {
    const facetFilters = buildFacetFilters(defaultBuildFacetFilterParam)
    expect(facetFilters).toEqual({ facetFilters: [['offer.isEducational:false']] })
  })

  it('should return default and isForbiddenToUnderage facets when user specified underage', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      isUserUnderage: true,
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.isForbiddenToUnderage:false']],
    })
  })

  it('should return default and category facets when category specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      offerCategories: [SearchGroupNameEnumv2.CONCERTS_FESTIVALS],
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.searchGroupNamev2:CONCERTS_FESTIVALS']],
    })
  })

  it('should return default and subcategory facets when subcategory specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      offerSubcategories: [SubcategoryIdEnumv2.CONCERT],
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.subcategoryId:CONCERT']],
    })
  })

  it('should return default and genre type facets when genre type specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      offerGenreTypes: [{ key: GenreType.MUSIC, name: 'Pop', value: 'Pop' }],
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.musicType:Pop']],
    })
  })

  it('should return default and objects id facets when objects id specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      objectIds: ['15000'],
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['objectID:15000']],
    })
  })
  it('should return default and ean facets when EAN specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      eanList: ['9780000000001'],
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.ean:9780000000001']],
    })
  })

  it('should return default and offer type facets when at least one of offer types set to true', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      offerTypes: { isEvent: true, isDigital: false, isThing: false },
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.isEvent:true']],
    })
  })

  it('should return default and offer is duo facets when offer is duo set to true', () => {
    const facetFilters = buildFacetFilters({ ...defaultBuildFacetFilterParam, offerIsDuo: true })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.isDuo:true']],
    })
  })

  it('should return default and tags facets when tags specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      tags: ['Offre cinema spéciale pass culture'],
    })
    expect(facetFilters).toEqual({
      facetFilters: [
        ['offer.isEducational:false'],
        ['offer.tags:Offre cinema spéciale pass culture'],
      ],
    })
  })

  it('should return default and venue facets when location filter with venue specified', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      locationFilter: { locationType: LocationType.VENUE, venue: mockedSuggestedVenues[0] },
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['venue.id:5543']],
    })
  })

  it('should return only default facet when location filter is everywhere', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      locationFilter: { locationType: LocationType.EVERYWHERE },
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false']],
    })
  })

  it('should return only default facet when location filter is around me', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: 100 },
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false']],
    })
  })

  it('should return only default facet when location filter is place', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      locationFilter: { locationType: LocationType.PLACE, place, aroundRadius: 100 },
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false']],
    })
  })

  it('should return only default and isDigital facet to false with appLocation featureFlag enabled and includeDigitalOffers to false', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      enableAppLocation: true,
      includeDigitalOffers: false,
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false'], ['offer.isDigital:false']],
    })
  })

  it('should return only default with appLocation featureFlag enabled and includeDigitalOffers to true', () => {
    const facetFilters = buildFacetFilters({
      ...defaultBuildFacetFilterParam,
      enableAppLocation: true,
      includeDigitalOffers: true,
    })
    expect(facetFilters).toEqual({
      facetFilters: [['offer.isEducational:false']],
    })
  })
})
