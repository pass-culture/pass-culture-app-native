import { HomepageModuleType, VideoModule } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { adaptOffersModuleParameters } from 'libs/contentful/adapters/modules/helpers/adaptOffersModuleParameters'
import { VideoContentModel } from 'libs/contentful/types'

export const adaptVideoModule = (module: VideoContentModel): VideoModule | null => {
  if (module.fields === undefined) return null

  const videoThumbnail = buildImageUrl(module.fields.videoThumbnail.fields?.file.url)
  if (videoThumbnail === undefined) return null

  const offersModuleParameters = adaptOffersModuleParameters(module.fields.algoliaParameters)
  if (offersModuleParameters === null) return null

  return {
    type: HomepageModuleType.VideoModule,
    id: module.sys.id,
    title: module.fields.displayedTitle,
    videoTitle: module.fields.videoTitle,
    videoThumbnail,
    durationInMinutes: module.fields.durationInMinutes,
    youtubeVideoId: module.fields.youtubeVideoId,
    offersModuleParameters,
    color: module.fields.color,
    videoTag: module.fields.videoTag,
    offerTitle: module.fields.offerTitle,
    videoDescription: module.fields.videoDescription,
    videoPublicationDate: module.fields.videoPublicationDate,
    offerIds: module.fields.offerIds,
    eanList: module.fields.eanList,
  }
}
