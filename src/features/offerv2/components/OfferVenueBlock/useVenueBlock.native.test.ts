import Clipboard from '@react-native-clipboard/clipboard'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useVenueBlock } from 'features/offerv2/components/OfferVenueBlock/useVenueBlock'
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

describe('useVenueBlock', () => {
  it('should return venue name', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.venueName).toBe('PATHE BEAUGRENELLE')
  })

  it('should return address', () => {
    const { result } = renderHook(() => useVenueBlock({ venue: offerResponseSnap.venue }))

    expect(result.current.address).toBe('75008 PARIS 8, 2 RUE LAMENNAIS')
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
