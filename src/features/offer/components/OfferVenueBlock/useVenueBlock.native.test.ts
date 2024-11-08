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
}

describe('useVenueBlock without offer address', () => {
  it('should return venue name', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.venueName).toBe('PATHE BEAUGRENELLE')
  })

  it('should return address', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.venueAddress).toBe('75008 PARIS 8, 2 RUE LAMENNAIS')
  })

  it('should return isOfferAddressDifferent to false if offer address is not present', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.isOfferAddressDifferent).toEqual(false)
  })

  it('should copy address to clipboard', async () => {
    const spy = jest.spyOn(Clipboard, 'setString')
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    await result.current.onCopyAddressPress()

    expect(spy).toHaveBeenCalledWith('75008 PARIS 8, 2 RUE LAMENNAIS')
  })

  it('should show success snackbar when address is copied', async () => {
    jest.spyOn(Clipboard, 'getString').mockResolvedValueOnce('75008 PARIS 8, 2 RUE LAMENNAIS')

    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    await result.current.onCopyAddressPress()

    expect(mockShowSuccessSnackbar).toHaveBeenCalledWith({
      message: 'L’adresse a bien été copiée',
      timeout: undefined,
    })
  })

  it('should show error snackbar when address is not copied', async () => {
    jest.spyOn(Clipboard, 'getString').mockResolvedValueOnce('')

    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    await result.current.onCopyAddressPress()

    expect(mockShowErrorSnackbar).toHaveBeenCalledWith({
      message: 'Une erreur est survenue, veuillez réessayer',
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

    expect(result.current.venueAddress).toBe('75013 PARIS 13, 1 RUE DES CAFÉS')
  })

  it('should return isOfferAddressDifferent to true if offer address different than venue address', () => {
    const { result } = renderHook(() =>
      useVenueBlock({
        venue: offerWithAddress.venue,
        offerAddress: offerWithAddress.address,
      })
    )

    expect(result.current.isOfferAddressDifferent).toEqual(true)
  })

  it('should return isOfferAddressDifferent to false if offer address different and venue address are the same', () => {
    const offerWithSameAddress = {
      ...offerResponseSnap,
      address: {
        street: '2 RUE LAMENNAIS',
        postalCode: '75008',
        city: 'PARIS 8',
        label: 'PATHE BEAUGRENELLE',
        coordinates: { latitude: 20, longitude: 2 },
        timezone: 'Europe/Paris',
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

    expect(spy).toHaveBeenCalledWith('75013 PARIS 13, 1 RUE DES CAFÉS')
  })
})
