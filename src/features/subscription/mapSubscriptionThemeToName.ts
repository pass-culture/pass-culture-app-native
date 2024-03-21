import { SubscriptionTheme } from 'features/subscription/types'

export const mapSubscriptionThemeToName: Record<SubscriptionTheme, string> = {
  [SubscriptionTheme.CINEMA]: 'Cinéma',
  [SubscriptionTheme.LECTURE]: 'Lecture',
  [SubscriptionTheme.MUSIQUE]: 'Musique',
  [SubscriptionTheme.SPECTACLES]: 'Spectacles',
  [SubscriptionTheme.VISITES]: 'Visites et sorties',
  [SubscriptionTheme.COURS]: 'Cours et Ateliers',
}
