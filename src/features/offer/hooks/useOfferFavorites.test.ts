import { useRoute } from '__mocks__/@react-navigation/native'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderHook } from 'tests/utils'

import { useOfferFavorites } from './useOfferFavorites'

const mockAddFavorite = jest.fn()
const mockRemoveFavorite = jest.fn()

jest.mock('queries/favorites/useAddFavoriteMutation', () => ({
  useAddFavoriteMutation: () => ({ mutate: mockAddFavorite, isPending: false }),
}))

jest.mock('queries/favorites/useRemoveFavoriteMutation', () => ({
  useRemoveFavoriteMutation: () => ({ mutate: mockRemoveFavorite, isPending: false }),
}))

jest.mock('features/favorites/hooks/useFavorite', () => ({
  useFavorite: () => null,
}))

describe('useOfferFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useRoute.mockReturnValue({ params: { from: 'offer', id: offerResponseSnap.id } })
  })

  it('should return addFavorite as a function', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

    expect(result.current.addFavorite).toBeInstanceOf(Function)
  })

  it('should return removeFavorite as a function', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

    expect(result.current.removeFavorite).toBeInstanceOf(Function)
  })

  it('should return isAddFavoriteLoading as false initially', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

    expect(result.current.isAddFavoriteLoading).toBe(false)
  })

  it('should return isRemoveFavoriteLoading as false initially', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

    expect(result.current.isRemoveFavoriteLoading).toBe(false)
  })

  it('should return favorite as null when offer is not in favorites', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

    expect(result.current.favorite).toBeNull()
  })

  it('should return all expected properties', () => {
    const { result } = renderHook(() => useOfferFavorites(offerResponseSnap))

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
})
