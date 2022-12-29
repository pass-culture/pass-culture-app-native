import { BusinessModule, RecommendedOffersModule } from 'features/home/types'
import { BusinessNatifModule, RecommendationNatifModule } from 'libs/contentful/types'

const buildImageUrl = (url: string): string => {
  return `https:${url}`
}

export const adaptBusinessModule = (module: BusinessNatifModule): BusinessModule => {
  const leftIcon = module.fields.leftIcon?.fields.file.url
    ? buildImageUrl(module.fields.leftIcon?.fields.file.url)
    : undefined
  const image = buildImageUrl(module.fields.image?.fields.file.url)
  return {
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

export const adaptRecommendationModule = (
  modules: RecommendationNatifModule
): RecommendedOffersModule => ({
  id: modules.sys.id,
  displayParameters: modules.fields.displayParameters.fields,
  recommendationParameters: modules.fields.recommendationParameters?.fields,
})
