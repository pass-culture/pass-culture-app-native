export const AnchorNames = {
  MOVIE_CALENDAR: 'movie-calendar',
  OFFER_CINE_AVAILABILITIES: 'offer-cine-availabilities',
  VENUE_CINE_AVAILABILITIES: 'venue-cine-availabilities',
  CHRONICLES_SECTION: 'chronicles-section',
  VIDEO_PLAYBACK: 'video-playback',
  COOKIES_ACCORDION: 'cookies-accordion',
} as const

export type AnchorName = (typeof AnchorNames)[keyof typeof AnchorNames]
