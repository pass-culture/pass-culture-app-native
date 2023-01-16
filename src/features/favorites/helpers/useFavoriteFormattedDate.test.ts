import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { useFavoriteFormattedDate } from 'features/favorites/helpers/useFavoriteFormattedDate'
import { renderHook } from 'tests/utils'

describe('useFavoriteFormattedDate', () => {
  it('should return formetted date when offer date is provided', () => {
    const offerWithDate = favoriteOfferResponseSnap
    const { result } = renderHook(() => useFavoriteFormattedDate({ offer: offerWithDate }))
    expect(result.current).toEqual('1 avril 2021')
  })

  it('should return formetted date with prefix "Dès le" when offer started date is provided', () => {
    const offerWithStartDate = {
      ...favoriteOfferResponseSnap,
      date: null,
      startDate: '2021-04-04T12:00:00',
    }
    const { result } = renderHook(() => useFavoriteFormattedDate({ offer: offerWithStartDate }))
    expect(result.current).toEqual('Dès le 4 avril 2021')
  })

  it('should not return date when date or started date is not provided', () => {
    const offerWithoutDate = {
      ...favoriteOfferResponseSnap,
      date: null,
      startDate: null,
    }
    const { result } = renderHook(() => useFavoriteFormattedDate({ offer: offerWithoutDate }))
    expect(result.current).toBeUndefined()
  })
})
