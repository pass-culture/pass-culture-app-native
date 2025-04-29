import { SharedValue } from 'react-native-reanimated'
import { ICarouselInstance } from 'react-native-reanimated-carousel'

export type CarouselPaginationProps = {
  progressValue: SharedValue<number>
  elementsCount: number
  gap: number
  carouselRef: React.RefObject<ICarouselInstance>
}
