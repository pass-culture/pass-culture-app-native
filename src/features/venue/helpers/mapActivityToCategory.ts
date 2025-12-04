import { Activity } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

export const mapActivityToCategory: Record<Activity, SubscriptionTheme | null> = {
  ART_GALLERY: null,
  ART_SCHOOL: SubscriptionTheme.ACTIVITES,
  ARTS_CENTRE: null,
  BOOKSTORE: SubscriptionTheme.LECTURE,
  CINEMA: SubscriptionTheme.CINEMA,
  COMMUNITY_CENTRE: null,
  CREATIVE_ARTS_STORE: SubscriptionTheme.ACTIVITES,
  CULTURAL_CENTRE: null,
  DISTRIBUTION_STORE: null,
  FESTIVAL: SubscriptionTheme.VISITES,
  GAMES_CENTRE: null,
  HERITAGE_SITE: SubscriptionTheme.VISITES,
  LIBRARY: SubscriptionTheme.LECTURE,
  MUSEUM: SubscriptionTheme.VISITES,
  MUSIC_INSTRUMENT_STORE: SubscriptionTheme.MUSIQUE,
  NOT_ASSIGNED: null,
  OTHER: null,
  PERFORMANCE_HALL: SubscriptionTheme.MUSIQUE,
  RECORD_STORE: SubscriptionTheme.MUSIQUE,
  SCIENCE_CENTRE: null,
  TOURIST_INFORMATION_CENTRE: null,
}
