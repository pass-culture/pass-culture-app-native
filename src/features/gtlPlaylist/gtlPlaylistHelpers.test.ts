import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { OffersModuleParameters } from 'features/home/types'
import { PlaylistOffersParams } from 'libs/algolia/types'
import { ContentfulLabelCategories, DisplayParametersFields } from 'libs/contentful/types'
import { LocationMode } from 'libs/location/types'

import {
  filterByContentfulLabel,
  filterGtlPlaylistConfigByLabel,
  getContentfulLabelByVenueType,
  getGtlPlaylistsParams,
  getLabelFilter,
} from './gtlPlaylistHelpers'

const mockVenue: Omit<VenueResponse, 'isVirtual'> = {
  name: 'Une librairie',
  city: 'Jest',
  id: 123,
  accessibility: {},
  timezone: 'Europe/Paris',
  venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE,
  isOpenToPublic: true,
}

const defaultDisplayParameters: DisplayParametersFields = {
  title: '',
  layout: 'two-items',
  minOffers: 1,
  subtitle: '',
}

const mockPlaylistConfig: GtlPlaylistRequest[] = [
  {
    id: '1',
    displayParameters: defaultDisplayParameters,
    offersModuleParameters: {
      title: 'Playlist 1',
      categories: ['Musique'] as ContentfulLabelCategories[],
      hitsPerPage: 1,
    },
  },
  {
    id: '2',
    displayParameters: defaultDisplayParameters,
    offersModuleParameters: {
      title: 'Playlist 2',
      categories: ['Livres'] as ContentfulLabelCategories[],
      hitsPerPage: 1,
    },
  },
  {
    id: '3',
    displayParameters: defaultDisplayParameters,
    offersModuleParameters: {
      title: 'Playlist 3',
      categories: ['Cinéma'] as ContentfulLabelCategories[],
      hitsPerPage: 1,
    },
  },
]

const mockAdaptPlaylistParameters = (parameters: OffersModuleParameters): PlaylistOffersParams => ({
  offerParams: {
    hitsPerPage: parameters.hitsPerPage,
    offerCategories: [],
    offerSubcategories: [],
    offerIsDuo: false,
    isDigital: false,
    priceRange: [0, 300],
    tags: [],
    date: null,
    timeRange: null,
    query: '',
    minBookingsThreshold: parameters.minBookingsThreshold,
    offerGenreTypes: [],
    offerGtlLabel: 'Romance',
    offerGtlLevel: 3,
  },
  locationParams: {
    selectedLocationMode: LocationMode.EVERYWHERE,
    userLocation: null,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
  },
})

describe('gtlPlaylist helpers functions', () => {
  describe('getContentfulLabelByVenueType', () => {
    it('should return the correct contentful label for a venue type', () => {
      expect(getContentfulLabelByVenueType(VenueTypeCodeKey.BOOKSTORE)).toBe('Livres')
      expect(getContentfulLabelByVenueType(VenueTypeCodeKey.RECORD_STORE)).toBe('Musique')
    })

    it('should return undefined when venue type is null or undefined', () => {
      expect(getContentfulLabelByVenueType(null)).toBeUndefined()
      expect(getContentfulLabelByVenueType(undefined)).toBeUndefined()
    })
  })

  describe('filterByContentfulLabel', () => {
    it('should filter playlist config by the given label', () => {
      const result = filterByContentfulLabel(mockPlaylistConfig, 'Musique')

      expect(result).toHaveLength(1)
      expect(result[0]?.offersModuleParameters.title).toBe('Playlist 1')
    })

    it('should return empty array when no playlist matches the label', () => {
      const result = filterByContentfulLabel(mockPlaylistConfig, 'Jeux & jeux vidéos')

      expect(result).toHaveLength(0)
    })
  })

  describe('getLabelFilter', () => {
    it('should return searchGroupLabel when provided', () => {
      const result = getLabelFilter(VenueTypeCodeKey.BOOKSTORE, 'Musique')

      expect(result).toBe('Musique')
    })

    it('should return venue type label when searchGroupLabel not provided', () => {
      const result = getLabelFilter(VenueTypeCodeKey.BOOKSTORE, undefined)

      expect(result).toBe('Livres')
    })

    it('should return undefined when both parameters are undefined', () => {
      const result = getLabelFilter(undefined, undefined)

      expect(result).toBeUndefined()
    })
  })

  describe('filterGtlPlaylistConfigByLabel', () => {
    it('should filter config by venueType when searchGroupLabel is not provided', () => {
      const result = filterGtlPlaylistConfigByLabel(
        mockPlaylistConfig,
        VenueTypeCodeKey.BOOKSTORE,
        undefined
      )

      expect(result).toHaveLength(1)
      expect(result[0]?.offersModuleParameters.title).toBe('Playlist 2')
    })

    it('should filter config by searchGroupLabel when provided', () => {
      const result = filterGtlPlaylistConfigByLabel(
        mockPlaylistConfig,
        VenueTypeCodeKey.BOOKSTORE,
        'Musique'
      )

      expect(result).toHaveLength(1)
      expect(result[0]?.offersModuleParameters.title).toBe('Playlist 1')
    })

    it('should return the entire playlist config when no label filter can be determined', () => {
      const result = filterGtlPlaylistConfigByLabel(mockPlaylistConfig, undefined, undefined)

      expect(result).toHaveLength(3)
    })
  })

  describe('getGtlPlaylistsParams', () => {
    it('should return adapted params with venue information when venue is provided', () => {
      const result = getGtlPlaylistsParams(
        mockPlaylistConfig,
        mockVenue,
        mockAdaptPlaylistParameters
      )

      expect(result).toHaveLength(mockPlaylistConfig.length)
      expect(result[0]?.offerParams.venue).toEqual({
        venueId: mockVenue.id,
        info: mockVenue.city,
        label: mockVenue.name,
        isOpenToPublic: mockVenue.isOpenToPublic,
        venue_type: mockVenue.venueTypeCode,
      })
    })

    it('should return adapted params without venue information when venue is undefined', () => {
      const result = getGtlPlaylistsParams(
        mockPlaylistConfig,
        undefined,
        mockAdaptPlaylistParameters
      )

      expect(result).toHaveLength(mockPlaylistConfig.length)
      expect(result[0]?.offerParams.venue).toBeUndefined()
    })
  })
})
