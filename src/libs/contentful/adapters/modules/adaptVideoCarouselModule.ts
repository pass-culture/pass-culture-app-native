import { VideoCarouselItem, VideoCarouselModule, HomepageModuleType } from 'features/home/types'
import {
  VideoCarouselContentModel,
  VideoCarouselItemContentModel as VideoCarouselItemListContentModel,
} from 'libs/contentful/types'

export const adaptVideoCarouselModule = (
  module: VideoCarouselContentModel
): VideoCarouselModule | null => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.VideoCarouselModule,
    title: module.fields.title,
    color: module.fields.color,
    items: adaptVideoCarouselItemModule(module.fields.items),
  }
}

const adaptVideoCarouselItemModule = (
  videoCarouselItemList: VideoCarouselItemListContentModel[]
): VideoCarouselItem[] =>
  videoCarouselItemList
    .filter((item) => !!item?.fields)
    .map((item) => {
      return {
        id: item.sys.id,
        title: item.fields.title,
        youtubeVideoId: item.fields.youtubeVideoId,
        tag: item.fields?.tag,
        offerId: item.fields?.offerId,
        homeEntryId: item.fields?.homeEntryId,
        thematicHomeTag: item.fields?.thematicHomeTag,
        thematicHomeTitle: item.fields?.thematicHomeTitle,
        thematicHomeSubtitle: item.fields?.thematicHomeSubtitle,
      }
    })
