import Clipboard from '@react-native-clipboard/clipboard'

import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderHook } from 'tests/utils'

// Mock useSnackBarContext to allow spy on showSuccessSnackBar
const mockShowSuccessSnackbar = jest.fn()
const mockShowErrorSnackbar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackbar,
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
}))

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

describe('useVenueBlock without offer address', () => {
  it('should return venue name', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.venueName).toBe('PATHE BEAUGRENELLE')
  })

  it('should return address', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.venueAddress).toBe('2 RUE LAMENNAIS, 75008 PARIS 8')
  })

  it('should return isOfferAddressDifferent to false if offer address is not present', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.isOfferAddressDifferent).toEqual(false)
  })

  it('should copy address to clipboard', async () => {
    const spy = jest.spyOn(Clipboard, 'setString')
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    await result.current.onCopyAddressPress()

    expect(spy).toHaveBeenCalledWith('2 RUE LAMENNAIS, 75008 PARIS 8')
  })

  it('should show error snackbar when address is not copied', async () => {
    jest.spyOn(Clipboard, 'getString').mockResolvedValueOnce('')

    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    await result.current.onCopyAddressPress()

    expect(mockShowErrorSnackbar).toHaveBeenCalledWith({
      message: 'Une erreur est survenue, veuillez réessayer.',
      timeout: undefined,
    })
  })
})

describe('useVenueBlock with offer address', () => {
  it('should return venue name from offer address', () => {
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithAddress.venue,
        offerAddress: offerWithAddress.address,
      })
    )

    expect(result.current.venueName).toBe('PATHE MONTPARNASSE')
  })

  it('should return address from  offer address', () => {
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithAddress.venue,
        offerAddress: offerWithAddress.address,
      })
    )

    expect(result.current.venueAddress).toBe('1 RUE DES CAFÉS, 75013 PARIS 13')
  })

  it('should return isOfferAddressDifferent to true if offer and venue address ids are different', () => {
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithAddress.venue,
        offerAddress: offerWithAddress.address,
      })
    )

    expect(result.current.isOfferAddressDifferent).toEqual(true)
  })

  it('should return isOfferAddressDifferent to false if offer and venue address are the same', () => {
    const offerWithSameAddress = {
      ...offerWithAddress,
      venue: {
        ...offerWithAddress.venue,
        addressId: 123,
      },
    }
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithSameAddress.venue,
        offerAddress: offerWithSameAddress.address,
      })
    )

    expect(result.current.isOfferAddressDifferent).toEqual(false)
  })

  it('should copy address to clipboard', async () => {
    const spy = jest.spyOn(Clipboard, 'setString')
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithAddress.venue,
        offerAddress: offerWithAddress.address,
      })
    )

    await result.current.onCopyAddressPress()

    expect(spy).toHaveBeenCalledWith('1 RUE DES CAFÉS, 75013 PARIS 13')
  })
})
