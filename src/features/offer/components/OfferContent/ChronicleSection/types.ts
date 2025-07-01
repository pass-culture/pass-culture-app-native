import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ChronicleSectionProps = {
  data: ChronicleCardData[]
  title: string
  subtitle?: string
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  onSeeMoreButtonPress?: (chronicleId: number) => void
  style?: StyleProp<ViewStyle>
  chronicleIcon?: ReactNode
}

export type ChronicleVariantInfo = {
  titleSection: string
  subtitleSection: string
  subtitleItem: string
  Icon?: React.ReactNode
}
