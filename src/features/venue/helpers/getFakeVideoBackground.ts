import { VenueTypeCodeKey } from 'api/gen'
import bookstore from 'ui/images/bg-bookstore.jpeg'
import concert from 'ui/images/bg-concert.jpeg'
import movie from 'ui/images/bg-movie.jpeg'
import museum from 'ui/images/bg-museum.jpeg'
import other from 'ui/images/bg-other.jpeg'
import store from 'ui/images/bg-store.jpeg'

export const getFakeVideoBackground = (type?: VenueTypeCodeKey | null) => {
  switch (type) {
    case VenueTypeCodeKey.BOOKSTORE:
    case VenueTypeCodeKey.LIBRARY:
      return bookstore
    case VenueTypeCodeKey.MOVIE:
    case VenueTypeCodeKey.TRAVELING_CINEMA:
      return movie
    case VenueTypeCodeKey.FESTIVAL:
    case VenueTypeCodeKey.CONCERT_HALL:
    case VenueTypeCodeKey.PERFORMING_ARTS:
      return concert
    case VenueTypeCodeKey.RECORD_STORE:
    case VenueTypeCodeKey.DISTRIBUTION_STORE:
    case VenueTypeCodeKey.CREATIVE_ARTS_STORE:
    case VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE:
      return store
    case VenueTypeCodeKey.VISUAL_ARTS:
    case VenueTypeCodeKey.CULTURAL_CENTRE:
    case VenueTypeCodeKey.MUSEUM:
    case VenueTypeCodeKey.PATRIMONY_TOURISM:
      return museum
    default:
      return other
  }
}
