import { SubcategoryIdEnum } from 'api/gen'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Position, LocationMode } from 'libs/location/types'
import {
  getVenueList,
  filterVenueOfferHit,
  useSearchVenueOffersInfiniteQuery,
} from 'queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery'
import { toMutable } from 'shared/types/toMutable'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

jest.useFakeTimers()

describe('useSearchVenueOffersInfiniteQuery', () => {
  describe('getVenueList', () => {
    it('should return an offer venues list', () => {
      const offerVenues = getVenueList(mockedAlgoliaResponse.hits, mockUserLocation)

      expect(offerVenues).toEqual([
        {
          address: '75000 Paris, 1 rue de la paix',
          offerId: 102280,
          title: 'Lieu 1',
          distance: '4,5 km',
        },
        {
          address: '75000 Paris, 2 rue de la paix',
          offerId: 102272,
          title: 'Lieu 2',
          distance: '2,4 km',
        },
        {
          address: '75000 Paris, 3 rue de la paix',
          offerId: 102249,
          title: 'Lieu 3',
          distance: '900+ km',
        },
        {
          address: '75000 Paris, 4 rue de la paix',
          offerId: 102310,
          title: 'Lieu 4',
          distance: '900+ km',
        },
      ])
    })

    it('should return the venue with the cheapest offer', () => {
      const hits = [
        {
          offer: {
            dates: [],
            isDigital: false,
            isDuo: false,
            name: 'La nuit des temps',
            prices: [35.0],
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            thumbUrl:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDNQ',
          },
          _geoloc: { lat: 48.94374, lng: 2.48171 },
          objectID: '102280',
          venue: {
            id: 1,
            name: 'Lieu 1',
            publicName: 'Lieu 1',
            address: '1 rue de la paix',
            postalCode: '75000',
            city: 'Paris',
          },
        },
        {
          offer: {
            dates: [],
            isDigital: false,
            isDuo: false,
            name: 'La nuit des temps',
            prices: [28.0],
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            thumbUrl:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDNQ',
          },
          _geoloc: { lat: 48.94374, lng: 2.48171 },
          objectID: '102281',
          venue: {
            id: 1,
            name: 'Lieu 1',
            publicName: 'Lieu 1',
            address: '1 rue de la paix',
            postalCode: '75000',
            city: 'Paris',
          },
        },
      ]
      const offerVenues = getVenueList(hits, mockUserLocation)

      expect(offerVenues).toEqual([
        {
          address: '75000 Paris, 1 rue de la paix',
          offerId: 102281,
          title: 'Lieu 1',
          distance: '4,5 km',
        },
      ])
    })
  })

  describe('filterVenueOfferHit', () => {
    it('should return false when object id hit = offerId param', () => {
      const shouldFilterVenueOfferHit = filterVenueOfferHit({
        hit: toMutable(mockedAlgoliaResponse.hits)[0],
        offerId: 102280,
        venueId: 1,
      })

      expect(shouldFilterVenueOfferHit).toEqual(false)
    })

    it('should return false when id venue hit = venueId param', () => {
      const shouldFilterVenueOfferHit = filterVenueOfferHit({
        hit: mockedAlgoliaResponse.hits[0],
        offerId: 102281,
        venueId: 1,
      })

      expect(shouldFilterVenueOfferHit).toEqual(false)
    })

    it('should return true when subcategory hit is defined, object id hit not equal to offerId param and id venue hit not equal to venueId param', () => {
      const shouldFilterVenueOfferHit = filterVenueOfferHit({
        hit: mockedAlgoliaResponse.hits[0],
        offerId: 102281,
        venueId: 2,
      })

      expect(shouldFilterVenueOfferHit).toEqual(true)
    })
  })

  describe('useSearchVenueOffersInfiniteQuery', () => {
    const fetchOfferSpy = jest
      .spyOn(fetchAlgoliaOffer, 'fetchOffers')
      .mockResolvedValue(mockedAlgoliaResponse)

    it('should fetch offers when queryOptions.enabled is true', async () => {
      renderHook(
        () =>
          useSearchVenueOffersInfiniteQuery({
            offerId: 10000,
            venueId: 1,
            query: '9782070584628',
            geolocation: { latitude: 48.94374, longitude: 2.48171 },
            queryOptions: { enabled: true },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await waitFor(() => {
        expect(fetchOfferSpy).toHaveBeenCalledTimes(1)
      })
    })

    it('should not fetch offers when queryOptions.enabled is false', async () => {
      renderHook(
        () =>
          useSearchVenueOffersInfiniteQuery({
            offerId: 10000,
            venueId: 1,
            query: '9782070584628',
            geolocation: { latitude: 48.94374, longitude: 2.48171 },
            queryOptions: { enabled: false },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await waitFor(() => {
        expect(fetchOfferSpy).not.toHaveBeenCalled()
      })
    })
  })
})
