import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderHook, act } from 'tests/utils'

import { useOfferFavorites } from './useOfferFavorites'

const mockAddFavorite = jest.fn()
const mockRemoveFavorite = jest.fn()
let capturedOnSuccess: (() => void) | undefined
let capturedOnError: (() => void) | undefined

jest.mock('queries/favorites/useAddFavoriteMutation', () => ({
  useAddFavoriteMutation: ({ onSuccess }: { onSuccess: () => void }) => {
    capturedOnSuccess = onSuccess

    return { mutate: mockAddFavorite, isPending: false }
  },
}))

jest.mock('queries/favorites/useRemoveFavoriteMutation', () => ({
  useRemoveFavoriteMutation: ({ onError }: { onError: () => void }) => {
    capturedOnError = onError

    return { mutate: mockRemoveFavorite, isPending: false }
  },
}))

jest.mock('ui/designSystem/Snackbar/snackBar.store', () => ({
  showErrorSnackBar: jest.fn(),
}))

jest.mock('features/favorites/hooks/useFavorite', () => ({
  useFavorite: () => null,
}))

jest.mock('libs/analytics/provider', () => ({
  analytics: { logHasAddedOfferToFavorites: jest.fn() },
}))

jest.mock('features/offer/helpers/getIsAComingSoonOffer', () => ({
  getIsAComingSoonOffer: () => false,
}))

const mockParams = { from: 'offer' as const, id: offerResponseSnap.id }

describe('useOfferFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedOnSuccess = undefined
    capturedOnError = undefined
  })

  it('should return addFavorite as a function', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current.addFavorite).toBeInstanceOf(Function)
  })

  it('should return removeFavorite as a function', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current.removeFavorite).toBeInstanceOf(Function)
  })

  it('should return isAddFavoriteLoading as false initially', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current.isAddFavoriteLoading).toBe(false)
  })

  it('should return isRemoveFavoriteLoading as false initially', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current.isRemoveFavoriteLoading).toBe(false)
  })

  it('should return favorite as null when offer is not in favorites', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current.favorite).toBeNull()
  })

  it('should return all expected properties', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    expect(result.current).toEqual(
      expect.objectContaining({
        addFavorite: expect.any(Function),
        isAddFavoriteLoading: expect.any(Boolean),
        removeFavorite: expect.any(Function),
        isRemoveFavoriteLoading: expect.any(Boolean),
        favorite: null,
      })
    )
  })

  it('should call analytics.logHasAddedOfferToFavorites with correct params on addFavorite success', () => {
    const { analytics } = jest.requireMock('libs/analytics/provider')
    renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    act(() => {
      capturedOnSuccess?.()
    })

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith(
      expect.objectContaining({
        offerId: offerResponseSnap.id,
        from: 'offer',
      })
    )
  })

  it('should not call analytics.logHasAddedOfferToFavorites when params are not provided', () => {
    const { analytics } = jest.requireMock('libs/analytics/provider')
    renderHook(() => useOfferFavorites(offerResponseSnap))

    act(() => {
      capturedOnSuccess?.()
    })

    expect(analytics.logHasAddedOfferToFavorites).not.toHaveBeenCalled()
  })

  it('should call showErrorSnackBar when removeFavorite fails', () => {
    const { showErrorSnackBar } = jest.requireMock('ui/designSystem/Snackbar/snackBar.store')
    renderHook(() => useOfferFavorites(offerResponseSnap, mockParams))

    act(() => {
      capturedOnError?.()
    })

    expect(showErrorSnackBar).toHaveBeenCalledWith(expect.any(String))
  })
})
