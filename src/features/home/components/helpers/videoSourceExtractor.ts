import { VideoCarouselItem } from 'features/home/types'

export const videoSourceExtractor = (items: VideoCarouselItem[]) => {
  return items.map((videoItem) => videoItem.youtubeVideoId)
}
