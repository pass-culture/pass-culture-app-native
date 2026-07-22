import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ClubAdviceSectionProps = {
  data: AdviceCardData[]
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  variantInfo: AdviceVariantInfo
  onShowClubAdviceWritersModal: () => void
  onBeforeNavigate?: () => void
  onSeeMoreButtonPress?: (chronicleId: number) => void
  displayAllAdvicesButton?: boolean
  showSectionTag?: boolean
  feedback?: ReactNode
  style?: StyleProp<ViewStyle>
}
