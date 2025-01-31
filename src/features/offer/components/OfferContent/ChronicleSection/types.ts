import { StyleProp, ViewStyle } from 'react-native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type ChronicleSectionProps = {
  data: ChronicleCardData[]
  title: string
  subtitle?: string
  ctaLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  style?: StyleProp<ViewStyle>
}
