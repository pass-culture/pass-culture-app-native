import { StyleProp, ViewStyle } from 'react-native'

import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { BOOK_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ClubAdviceSectionProps = {
  data: AdviceCardData[]
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  variantInfo: AdviceVariantInfo
  onShowClubAdviceWritersModal: () => void
  onBeforeNavigate?: () => void
  onSeeMoreButtonPress?: (chronicleId: number) => void
  style?: StyleProp<ViewStyle>
}

export type BookClubSubcategoryId = (typeof BOOK_CLUB_SUBCATEGORIES)[number]
