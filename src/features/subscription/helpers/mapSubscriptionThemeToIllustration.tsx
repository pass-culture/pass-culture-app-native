import { CATEGORY_APPEARANCE } from 'features/search/enums'
import { SubscriptionTheme } from 'features/subscription/types'
import { AccessibleRectangleIcon } from 'ui/svg/icons/types'

interface IllustrationFeatures {
  illustration: React.FC<AccessibleRectangleIcon>
  gradients: string[]
}

export const mapSubscriptionThemeToIllustration = (
  thematic: SubscriptionTheme
): IllustrationFeatures => {
  switch (thematic) {
    case SubscriptionTheme.CINEMA:
      return CATEGORY_APPEARANCE.CINEMA
    case SubscriptionTheme.LECTURE:
      return CATEGORY_APPEARANCE.LIVRES
    case SubscriptionTheme.MUSIQUE:
      return CATEGORY_APPEARANCE.CONCERTS_FESTIVALS
    case SubscriptionTheme.SPECTACLES:
      return CATEGORY_APPEARANCE.SPECTACLES
    case SubscriptionTheme.VISITES:
      return CATEGORY_APPEARANCE.MUSEES_VISITES_CULTURELLES
    case SubscriptionTheme.ACTIVITES:
      return CATEGORY_APPEARANCE.ARTS_LOISIRS_CREATIFS
  }
}
