import { StyleProp, ViewStyle } from 'react-native'

export type CarouselPaginationProps = {
  progressValue: number
  elementsCount: number
  gap: number
  carouselRef: React.RefObject<number>
  style?: StyleProp<ViewStyle>
}
