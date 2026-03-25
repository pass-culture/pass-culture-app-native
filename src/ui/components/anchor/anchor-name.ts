export const AnchorNames = {
  MOVIE_CALENDAR: 'movie-calendar',
  OFFER_CINE_AVAILABILITIES: 'offer-cine-availabilities',
  VENUE_CINE_AVAILABILITIES: 'venue-cine-availabilities',
  CLUB_ADVICE_SECTION: 'club-advice-section',
  VIDEO_PLAYBACK: 'video-playback',
  COOKIES_ACCORDION: 'cookies-accordion',
} as const

export type AnchorName = (typeof AnchorNames)[keyof typeof AnchorNames]
