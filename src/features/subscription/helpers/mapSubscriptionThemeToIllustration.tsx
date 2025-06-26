import { CATEGORY_CRITERIA } from 'features/search/enums'
import { SubscriptionTheme } from 'features/subscription/types'
import { BackgroundColorKey } from 'theme/types'
import { AccessibleRectangleIcon } from 'ui/svg/icons/types'

interface IllustrationFeatures {
  illustration: React.FC<AccessibleRectangleIcon>
  fillColor: BackgroundColorKey
}

export const mapSubscriptionThemeToIllustration = (
  thematic: SubscriptionTheme
): IllustrationFeatures => {
  switch (thematic) {
    case SubscriptionTheme.CINEMA:
      return CATEGORY_CRITERIA.CINEMA
    case SubscriptionTheme.LECTURE:
      return CATEGORY_CRITERIA.LIVRES
    case SubscriptionTheme.MUSIQUE:
      return CATEGORY_CRITERIA.CONCERTS_FESTIVALS
    case SubscriptionTheme.SPECTACLES:
      return CATEGORY_CRITERIA.SPECTACLES
    case SubscriptionTheme.VISITES:
      return CATEGORY_CRITERIA.MUSEES_VISITES_CULTURELLES
    case SubscriptionTheme.ACTIVITES:
      return CATEGORY_CRITERIA.ARTS_LOISIRS_CREATIFS
  }
}
