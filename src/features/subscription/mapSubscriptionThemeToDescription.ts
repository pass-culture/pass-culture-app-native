import { SubscriptionTheme } from 'features/subscription/types'

export const mapSubscriptionThemeToDescription: Record<SubscriptionTheme, string> = {
  [SubscriptionTheme.CINEMA]:
    'Tu recevras toute l’actu ciné (sorties, avant-premières…) et les bons plans\u00a0!',
  [SubscriptionTheme.LECTURE]:
    'Tu recevras nos recos lecture, nos jeux-concours et le meilleur de l’actu littéraire\u00a0!',
  [SubscriptionTheme.MUSIQUE]:
    'Tu recevras les bons plans musique et l’actu des événements près de chez toi\u00a0!',
  [SubscriptionTheme.SPECTACLES]:
    'Stand-up, théâtre, comédies musicales... tu recevras toute l’actu des événements près de chez toi\u00a0!',
  [SubscriptionTheme.VISITES]:
    'Tu recevras les meilleurs plans de sorties, visites, expos et évènements près de chez toi\u00a0!',
  [SubscriptionTheme.ACTIVITES]:
    'Tu recevras nos bons plans et toute l’actu des ateliers, cours et masterclass près de chez toi\u00a0!',
}
