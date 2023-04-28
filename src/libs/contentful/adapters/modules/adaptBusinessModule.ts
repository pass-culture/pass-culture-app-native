import { BusinessModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { BusinessContentModel } from 'libs/contentful/types'

export const adaptBusinessModule = (module: BusinessContentModel): BusinessModule | null => {
  if (module.fields === undefined) return null

  const image = buildImageUrl(module.fields.image.fields?.file.url)
  if (image === undefined) return null

  const leftIcon = buildImageUrl(module.fields.leftIcon?.fields?.file.url)
  return {
    type: HomepageModuleType.BusinessModule,
    id: module.sys.id,
    analyticsTitle: module.fields.title,
    image: image,
    title: module.fields.firstLine,
    subtitle: module.fields.secondLine,
    leftIcon: leftIcon,
    url: module.fields.url,
    shouldTargetNotConnectedUsers: module.fields.targetNotConnectedUsersOnly,
  }
}
