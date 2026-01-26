import { Activity, SubcategoryIdEnum } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import {
  getAddress,
  getDisplayedDataVenueBlock,
  getOfferLocationName,
  getVenueBlockProps,
  getVenueSectionTitle,
  getVenueSelectionHeaderMessage,
  mergeVenueData,
} from 'features/offerRefacto/helpers'
import { PartialVenue } from 'features/offerRefacto/types'
import venueResponse from 'fixtures/venueResponse'
import { LocationMode } from 'libs/location/types'

describe('getVenueSectionTitle', () => {
  it('should return "Lieu de retrait" when subcategory is not "Séances de cinéma" and offer is not an event', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.ABO_BIBLIOTHEQUE, false)

    expect(venueSectionTitle).toEqual('Lieu de retrait')
  })

  it('should return "Trouve ta séance" when subcategory is "Séances de cinéma"', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.SEANCE_CINE, false)

    expect(venueSectionTitle).toEqual('Trouve ta séance')
  })

  it('should return "Lieu de l’évènement" when offer is an event', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.CONCERT, true)

    expect(venueSectionTitle).toEqual('Lieu de l’évènement')
  })
})

describe('getVenueBlockProps', () => {
  it('should return venue with bannerUrl as undefined when bannerUrl is null', () => {
    const venue = { ...offerVenueResponseSnap, bannerUrl: null }

    expect(getVenueBlockProps(venue).bannerUrl).toEqual(undefined)
  })
})

describe('getAddress', () => {
  it('should return undefined when address is null', () => {
    expect(getAddress(null)).toEqual(undefined)
  })
})

describe('getVenueSelectionHeaderMessage', () => {
  const place = { label: 'Tour Eiffel', info: '', geolocation: { latitude: 0, longitude: 0 } }

  describe('AROUND_PLACE mode', () => {
    it('should return venue label when defined', () => {
      const result = getVenueSelectionHeaderMessage(LocationMode.AROUND_PLACE, place)

      expect(result).toEqual('Lieux à proximité de “Tour Eiffel”')
    })

    it('should return empty string when venue label not defined', () => {
      expect(
        getVenueSelectionHeaderMessage(LocationMode.AROUND_PLACE, { ...place, label: '' })
      ).toEqual('')
    })

    it('should return an empty string when place not defined', () => {
      expect(getVenueSelectionHeaderMessage(LocationMode.AROUND_PLACE, null)).toEqual('')
    })
  })

  describe('EVERYWHERE mode', () => {
    it('should return venue name when defined', () => {
      const result = getVenueSelectionHeaderMessage(
        LocationMode.EVERYWHERE,
        null,
        'Le Café de Paris'
      )

      expect(result).toEqual('Lieux à proximité de “Le Café de Paris”')
    })

    it('should return an empty string when venue name not defined', () => {
      const result = getVenueSelectionHeaderMessage(LocationMode.EVERYWHERE, null, undefined)

      expect(result).toEqual('')
    })
  })

  describe('Mode AROUND_ME', () => {
    it('should return around me message', () => {
      const result = getVenueSelectionHeaderMessage(LocationMode.AROUND_ME)

      expect(result).toBe('Lieux disponibles autour de moi')
    })
  })
})

describe('getDisplayedDataVenueBlock', () => {
  it('should return venue data when no offer address is provided', () => {
    const result = getDisplayedDataVenueBlock(offerResponseSnap.venue)

    expect(result).toEqual({
      venueName: 'PATHE BEAUGRENELLE',
      address: '2 RUE LAMENNAIS, 75008 PARIS 8',
      isOfferAddressDifferent: false,
    })
  })

  it('should return offer address data when an offer address is provided', () => {
    const offerAddress = {
      label: 'PATHE LOUVRE',
      street: '10 rue du Louvre',
      postalCode: '75001',
      city: 'Paris',
      id: 123,
    }

    const result = getDisplayedDataVenueBlock(offerResponseSnap.venue, offerAddress)

    expect(result).toEqual({
      venueName: 'PATHE LOUVRE',
      address: '10 rue du Louvre, 75001 Paris',
      isOfferAddressDifferent: true,
    })
  })
})

describe('getOfferLocationName', () => {
  it('should return offerer name when is digital offer', () => {
    const isDigital = true
    const venue = offerVenueResponseSnap
    const locationName = getOfferLocationName(venue, isDigital)

    expect(locationName).toEqual('Le Grand Rex')
  })

  describe('not digital offer', () => {
    const isDigital = false

    it('should return venue name', () => {
      const venue = {
        ...offerVenueResponseSnap,
        name: 'Le Grande Rex - name',
        publicName: undefined,
      }
      const locationName = getOfferLocationName(venue, isDigital)

      expect(locationName).toEqual('Le Grande Rex - name')
    })
  })
})

describe('mergeVenueData', () => {
  const partialVenue: PartialVenue = {
    id: 123,
    name: 'Lieu de Test',
    description: 'Une superbe description',
    isOpenToPublic: true,
  }

  it('should create a complete VenueResponse from PartialVenue when prevData is undefined', () => {
    const result = mergeVenueData(partialVenue)(undefined)

    expect(result).toEqual({
      id: 123,
      name: 'Lieu de Test',
      description: 'Une superbe description',
      isOpenToPublic: true,
      accessibility: {},
      contact: {},
      timezone: '',
      activity: Activity.OTHER,
    })
  })

  it('should let prevData properties override the initial partial venue values', () => {
    const result = mergeVenueData(partialVenue)({ ...venueResponse, isVirtual: false })

    expect(result.id).toEqual(venueResponse.id)
    expect(result.name).toEqual(venueResponse.name)
    expect(result.activity).toEqual(venueResponse.activity)
    expect(result.description).toEqual('Une superbe description')
  })
})
