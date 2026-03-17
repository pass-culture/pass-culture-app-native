import { offerToHeadlineOfferData } from 'features/headlineOffer/adapters/offerToHeadlineOfferData'
import { mockLabelMapping, mockMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { proAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { offersFixture } from 'shared/offer/offer.fixture'

describe('offerToHeadlineOfferData', () => {
  it('should transform headline offer data correctly', () => {
    const result = offerToHeadlineOfferData({
      offer: offersFixture[0],
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
    })

    expect(result).toEqual({
      id: '102280',
      categoryId: 'LIVRE',
      category: 'Livre papier',
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDNQ',
      offerTitle: 'La nuit des temps',
      price: 'Dès 28\u00a0€',
      distance: '900+ km',
    })
  })

  it('should return null if offer is undefined', () => {
    const result = offerToHeadlineOfferData({
      offer: undefined,
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
    })

    expect(result).toBeNull()
  })

  it('should return an empty string if imageUrl is undefined', () => {
    const offerWithoutImage = {
      ...offersFixture[0],
      offer: { ...offersFixture[0].offer, thumbUrl: undefined },
    }

    const result = offerToHeadlineOfferData({
      offer: offerWithoutImage,
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
    })

    expect(result?.imageUrl).toBe('')
  })

  it('should return undefined if geolocation is missing', () => {
    const offerWithoutGeoloc = {
      ...offersFixture[0],
      _geoloc: {
        lat: null,
        lng: null,
      },
    }

    const result = offerToHeadlineOfferData({
      offer: offerWithoutGeoloc,
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
    })

    expect(result?.distance).toBeUndefined()
  })

  it('should return pro advice if available and AB testing segment is A', () => {
    const offerWithAdvices = {
      ...offersFixture[0],
      objectID: '1',
    }

    const result = offerToHeadlineOfferData({
      offer: offerWithAdvices,
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
      advice: proAdvicesFixture[0],
      segment: 'A',
    })

    expect(result?.advice).toEqual(proAdvicesFixture[0])
  })

  it('should not return pro advice if available and AB testing segment is B', () => {
    const offerWithAdvices = {
      ...offersFixture[0],
      objectID: '1',
    }

    const result = offerToHeadlineOfferData({
      offer: offerWithAdvices,
      transformParameters: {
        mapping: mockMapping,
        labelMapping: mockLabelMapping,
        currency: Currency.EURO,
        euroToPacificFrancRate: 10,
        userLocation: { latitude: 1, longitude: 1 },
      },
      advice: proAdvicesFixture[0],
      segment: 'B',
    })

    expect(result?.advice).toEqual(undefined)
  })
})
