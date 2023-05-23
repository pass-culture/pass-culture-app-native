import { SubcategoryIdEnum } from 'api/gen'
import {
  filterVenueOfferHit,
  getOfferVenues,
  useSearchVenueOffersInfiniteQuery,
} from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

describe('useSearchVenueOffers', () => {
  describe('getOfferVenues', () => {
    it('should return an offer venues list', () => {
      const offerVenues = getOfferVenues(mockedAlgoliaResponse.hits)
      expect(offerVenues).toEqual([
        {
          address: '1 rue de la paix, 75000 Paris',
          coordinates: {
            lat: 48.94374,
            lng: 2.48171,
          },
          offerId: 102280,
          price: 28,
          title: 'Lieu 1',
          venueId: 1,
        },
        {
          address: '2 rue de la paix, 75000 Paris',
          coordinates: {
            lat: 48.91265,
            lng: 2.4513,
          },
          offerId: 102272,
          price: 23,
          title: 'Lieu 2',
          venueId: 2,
        },
        {
          address: '3 rue de la paix, 75000 Paris',
          coordinates: {
            lat: 4.90339,
            lng: -52.31663,
          },
          offerId: 102249,
          price: 34,
          title: 'Lieu 3',
          venueId: 3,
        },
        {
          address: '4 rue de la paix, 75000 Paris',
          coordinates: {
            lat: 4.90339,
            lng: -52.31663,
          },
          offerId: 102310,
          price: 28,
          title: 'Lieu 4',
          venueId: 4,
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
              'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
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
              'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
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
      const offerVenues = getOfferVenues(hits)
      expect(offerVenues).toEqual([
        {
          address: '1 rue de la paix, 75000 Paris',
          coordinates: {
            lat: 48.94374,
            lng: 2.48171,
          },
          offerId: 102281,
          price: 28,
          title: 'Lieu 1',
          venueId: 1,
        },
      ])
    })
  })

  describe('filterVenueOfferHit', () => {
    it('should return false when subcategory hit is undefined', () => {
      const shouldFilterVenueOfferHit = filterVenueOfferHit({
        hit: {
          ...mockedAlgoliaResponse.hits[0],
          offer: { ...mockedAlgoliaResponse.hits[0].offer, subcategoryId: undefined },
        },
        offerId: 102283,
        venueId: 2,
      })
      expect(shouldFilterVenueOfferHit).toEqual(false)
    })

    it('should return false when object id hit = offerId param', () => {
      const shouldFilterVenueOfferHit = filterVenueOfferHit({
        hit: mockedAlgoliaResponse.hits[0],
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

    it('should fetch offers', async () => {
      renderHook(
        () =>
          useSearchVenueOffersInfiniteQuery({
            offerId: 10000,
            venueId: 1,
            query: '9782070584628',
            geolocation: { latitude: 48.94374, longitude: 2.48171 },
          }),
        {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await waitFor(() => {
        expect(fetchOfferSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
