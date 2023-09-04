import { BusinessModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { BusinessContentModel } from 'libs/contentful/types'

export const adaptBusinessModule = (module: BusinessContentModel): BusinessModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields?.image.fields === undefined) return null

  const leftIcon = buildImageUrl(module.fields.leftIcon?.fields?.file.url)
  return {
    type: HomepageModuleType.BusinessModule,
    id: module.sys.id,
    analyticsTitle: module.fields.title,
    image: buildImageUrl(module.fields.image.fields.file.url),
    title: module.fields.firstLine,
    subtitle: module.fields.secondLine,
    leftIcon,
    url: module.fields.url,
    shouldTargetNotConnectedUsers: module.fields.targetNotConnectedUsersOnly,
    localizationArea: {
      latitude: module.fields.latitude,
      longitude: module.fields.longitude,
      radius: module.fields.radius,
    },
  }
}
