import { SubscriptionTheme } from 'features/subscription/types'

export const mapSubscriptionThematicToBlockTitles: Record<
  SubscriptionTheme,
  { title: string; subtitle: string }
> = {
  [SubscriptionTheme.CINEMA]: {
    title: 'Fan de cinéma\u00a0?',
    subtitle:
      'Avant-premières, rencontres exclusives, nouvelles sorties de films... on te fait profiter des meilleurs plans ciné\u00a0!',
  },
  [SubscriptionTheme.LECTURE]: {
    title: 'Fan de lecture\u00a0?',
    subtitle:
      'Reçois nos recos lecture, nos jeux-concours et le meilleur de l’actu littéraire\u00a0!',
  },
  [SubscriptionTheme.MUSIQUE]: {
    title: 'Fan de musique\u00a0?',
    subtitle:
      'Concerts, festivals... reçois les bons plans musique et l’actu des prochains événements près de chez toi\u00a0!',
  },
  [SubscriptionTheme.SPECTACLES]: {
    title: 'Fan de spectacles\u00a0?',
    subtitle:
      'Stand-up, théâtre, comédies musicales... reçois l’actu des événements près de chez toi\u00a0!',
  },
  [SubscriptionTheme.VISITES]: {
    title: 'Fan de sorties culturelles\u00a0?',
    subtitle:
      'Visites exclusives, expos, événements... reçois les meilleurs plans près de chez toi\u00a0!',
  },
  [SubscriptionTheme.ACTIVITES]: {
    title: 'Fan d’activités créatives\u00a0?',
    subtitle:
      'Ateliers, cours et matériel, du dessin à la musique\u00a0: reçois les meilleurs plans du moment\u00a0!',
  },
}
