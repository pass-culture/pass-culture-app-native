import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { ChronicleCardData } from 'features/chronicle/type'
import { BOOK_CLUB_SUBCATEGORIES } from 'features/offer/constant'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ChronicleSectionProps = {
  data: ChronicleCardData[]
  title: string
  subtitle?: string
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  onSeeMoreButtonPress?: (chronicleId: number) => void
  style?: StyleProp<ViewStyle>
  icon?: ReactNode
}

export type ChronicleVariantInfo = {
  titleSection: string
  subtitleSection: string
  subtitleItem: string
  Icon?: React.ReactNode
  modalWording: string
  modalButtonLabel: string
}

export type BookClubSubcategoryId = (typeof BOOK_CLUB_SUBCATEGORIES)[number]
