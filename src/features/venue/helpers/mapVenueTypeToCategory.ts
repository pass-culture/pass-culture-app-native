import { VenueTypeCodeKey } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

export const mapVenueTypeToCategory: Record<VenueTypeCodeKey, SubscriptionTheme | null> = {
  ARTISTIC_COURSE: SubscriptionTheme.ACTIVITES,
  BOOKSTORE: SubscriptionTheme.LECTURE,
  CONCERT_HALL: SubscriptionTheme.MUSIQUE,
  CREATIVE_ARTS_STORE: SubscriptionTheme.ACTIVITES,
  CULTURAL_CENTRE: null,
  DIGITAL: null,
  DISTRIBUTION_STORE: null,
  FESTIVAL: SubscriptionTheme.VISITES,
  GAMES: null,
  LIBRARY: SubscriptionTheme.LECTURE,
  MOVIE: SubscriptionTheme.CINEMA,
  MUSEUM: SubscriptionTheme.VISITES,
  MUSICAL_INSTRUMENT_STORE: SubscriptionTheme.MUSIQUE,
  OTHER: null,
  PATRIMONY_TOURISM: SubscriptionTheme.VISITES,
  PERFORMING_ARTS: SubscriptionTheme.SPECTACLES,
  RECORD_STORE: SubscriptionTheme.MUSIQUE,
  SCIENTIFIC_CULTURE: null,
  TRAVELING_CINEMA: SubscriptionTheme.CINEMA,
  VISUAL_ARTS: null,
}
