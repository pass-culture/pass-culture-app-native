import Clipboard from '@react-native-clipboard/clipboard'

import { getVenueBlock } from 'features/offer/components/OfferVenueBlock/getVenueBlock'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

const offerWithAddress = {
  ...offerResponseSnap,
  address: {
    id: 123,
    street: '1 RUE DES CAFÉS',
    postalCode: '75013',
    city: 'PARIS 13',
    label: 'PATHE MONTPARNASSE',
    coordinates: {
      latitude: 48.91683,
      longitude: 2.43884,
    },
    timezone: 'Europe/Paris',
  },
  venue: {
    ...offerResponseSnap.venue,
    addressId: 321,
  },
}

describe('getVenueBlock without offer address', () => {
  it('should return venue name', () => {
    const result = getVenueBlock({ venue: offerResponseSnap.venue })

    expect(result.venueName).toBe('PATHE BEAUGRENELLE')
  })

  it('should return address', () => {
    const result = getVenueBlock({ venue: offerResponseSnap.venue })

    expect(result.venueAddress).toBe('2 RUE LAMENNAIS, 75008 PARIS 8')
  })

  it('should return isOfferAddressDifferent to false if offer address is not present', () => {
    const result = getVenueBlock({ venue: offerResponseSnap.venue })

    expect(result.isOfferAddressDifferent).toEqual(false)
  })

  it('should copy address to clipboard', async () => {
    const spy = jest.spyOn(Clipboard, 'setString')
    const result = getVenueBlock({ venue: offerResponseSnap.venue })

    await result.onCopyAddressPress()

    expect(spy).toHaveBeenCalledWith('2 RUE LAMENNAIS, 75008 PARIS 8')
  })

  it('should show error snackbar when address is not copied', async () => {
    jest.spyOn(Clipboard, 'getString').mockResolvedValueOnce('')
    const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

    const result = getVenueBlock({ venue: offerResponseSnap.venue })

    await result.onCopyAddressPress()

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith(
      'Une erreur est survenue, veuillez réessayer.'
    )
  })
})

describe('getVenueBlock with offer address', () => {
  it('should return venue name from offer address', () => {
    const result = getVenueBlock({
      venue: offerWithAddress.venue,
      offerAddress: offerWithAddress.address,
    })

    expect(result.venueName).toBe('PATHE MONTPARNASSE')
  })

  it('should return address from  offer address', () => {
    const result = getVenueBlock({
      venue: offerWithAddress.venue,
      offerAddress: offerWithAddress.address,
    })

    expect(result.venueAddress).toBe('1 RUE DES CAFÉS, 75013 PARIS 13')
  })

  it('should return isOfferAddressDifferent to true if offer and venue address ids are different', () => {
    const result = getVenueBlock({
      venue: offerWithAddress.venue,
      offerAddress: offerWithAddress.address,
    })

    expect(result.isOfferAddressDifferent).toEqual(true)
  })

  it('should return isOfferAddressDifferent to false if offer and venue address are the same', () => {
    const offerWithSameAddress = {
      ...offerWithAddress,
      venue: {
        ...offerWithAddress.venue,
        addressId: 123,
      },
    }
    const result = getVenueBlock({
      venue: offerWithSameAddress.venue,
      offerAddress: offerWithSameAddress.address,
    })

    expect(result.isOfferAddressDifferent).toEqual(false)
  })

  it('should copy address to clipboard', async () => {
    const spy = jest.spyOn(Clipboard, 'setString')
    const result = getVenueBlock({
      venue: offerWithAddress.venue,
      offerAddress: offerWithAddress.address,
    })

    await result.onCopyAddressPress()

    expect(spy).toHaveBeenCalledWith('1 RUE DES CAFÉS, 75013 PARIS 13')
  })
})
