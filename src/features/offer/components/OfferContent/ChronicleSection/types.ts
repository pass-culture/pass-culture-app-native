import { StyleProp, ViewStyle } from 'react-native'

import { ChronicleCardData } from 'features/chronicle/type'
import { BOOK_CLUB_SUBCATEGORIES } from 'features/offer/constant'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ChronicleSectionProps = {
  data: ChronicleCardData[]
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  variantInfo: ChronicleVariantInfo
  onShowChroniclesWritersModal: () => void
  onBeforeNavigate?: () => void
  onSeeMoreButtonPress?: (chronicleId: number) => void
  style?: StyleProp<ViewStyle>
}

export type ChronicleVariantInfo = {
  labelReaction: string
  titleSection: string
  subtitleSection: string
  subtitleItem: string
  Icon?: React.ReactNode
  modalTitle: string
  modalWording: string
  modalButtonLabel: string
  SmallIcon?: React.ReactNode
}

export type BookClubSubcategoryId = (typeof BOOK_CLUB_SUBCATEGORIES)[number]
