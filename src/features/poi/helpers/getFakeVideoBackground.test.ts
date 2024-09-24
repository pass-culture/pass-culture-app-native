import { VenueTypeCodeKey } from 'api/gen'
import bookstore from 'ui/images/bg-bookstore.jpeg'
import concert from 'ui/images/bg-concert.jpeg'
import movie from 'ui/images/bg-movie.jpeg'
import museum from 'ui/images/bg-museum.jpeg'
import other from 'ui/images/bg-other.jpeg'
import store from 'ui/images/bg-store.jpeg'

import { getFakeVideoBackground } from './getFakeVideoBackground'

describe('getFakeVideoBackground', () => {
  it('should return correct image from key code', () => {
    expect(getFakeVideoBackground(VenueTypeCodeKey.BOOKSTORE)).toBe(bookstore)
    expect(getFakeVideoBackground(VenueTypeCodeKey.MOVIE)).toBe(movie)
    expect(getFakeVideoBackground(VenueTypeCodeKey.MUSEUM)).toBe(museum)
    expect(getFakeVideoBackground(VenueTypeCodeKey.CONCERT_HALL)).toBe(concert)
    expect(getFakeVideoBackground(VenueTypeCodeKey.RECORD_STORE)).toBe(store)
    expect(getFakeVideoBackground(VenueTypeCodeKey.GAMES)).toBe(other)
  })
})
