export enum SubscriptionTheme {
  CINEMA = 'cinema',
  LECTURE = 'lecture',
  MUSIQUE = 'musique',
  SPECTACLES = 'spectacles',
  ACTIVITES = 'activites_creatives',
  VISITES = 'visites',
}

export const SUSBCRIPTION_THEMES = Object.values(SubscriptionTheme)
export const TOTAL_NUMBER_OF_THEME = SUSBCRIPTION_THEMES.length

export type SubscriptionAnalyticsParams =
  | {
      type: 'in' | 'out'
      from: 'venue'
      venueId: string
    }
  | {
      type: 'in' | 'out'
      from: 'thematicHome'
      entryId: string
    }
  | {
      type: 'update'
      from: 'profile' | 'home'
    }
