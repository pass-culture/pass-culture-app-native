import { BusinessModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { buildLocalization } from 'libs/contentful/adapters/modules/helpers/buildLocalization'
import { BusinessContentModel } from 'libs/contentful/types'

export const adaptBusinessModule = (module: BusinessContentModel): BusinessModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields?.image.fields === undefined) return null

  const imageWeb = module.fields.imageWeb?.fields
    ? buildImageUrl(module.fields.imageWeb.fields.file.url)
    : undefined

  const localizationArea = buildLocalization(
    module.fields.latitude,
    module.fields.longitude,
    module.fields.radius
  )
  return {
    type: HomepageModuleType.BusinessModule,
    id: module.sys.id,
    analyticsTitle: module.fields.title,
    image: buildImageUrl(module.fields.image.fields.file.url),
    imageWeb,
    title: module.fields.firstLine,
    subtitle: module.fields.secondLine,
    url: module.fields.url,
    shouldTargetNotConnectedUsers: module.fields.targetNotConnectedUsersOnly,
    localizationArea,
    date: module.fields.date,
    callToAction: module.fields.callToAction,
  }
}
