import {
  BusinessModule,
  ExclusivityModule,
  RecommendedOffersModule,
  VenuesModule,
} from 'features/home/types'
import {
  BusinessNatifModule,
  ExclusivityNatifModule,
  RecommendationNatifModule,
  VenuesNatifModule,
} from 'libs/contentful/types'

const buildImageUrl = (url: string): string => {
  return `https:${url}`
}

const formatOfferIdToNumber = (offerId: string): number | undefined => {
  return Number.isNaN(Number(offerId)) ? undefined : Number(offerId)
}

const hasAtLeastOneField = (object: any) => {
  return Object.keys(object).length > 0
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

export const adaptVenuesModule = (modules: VenuesNatifModule): VenuesModule | null => {
  const venuesSearchParameters = modules.fields.venuesSearchParameters
    .filter((params) => params.fields && hasAtLeastOneField(params.fields))
    .map(({ fields }) => fields)

  if (venuesSearchParameters.length === 0) return null
  return {
    id: modules.sys.id,
    venuesSearchParameters: venuesSearchParameters,
    displayParameters: modules.fields.displayParameters.fields,
  }
}

export const adaptRecommendationModule = (
  modules: RecommendationNatifModule
): RecommendedOffersModule => ({
  id: modules.sys.id,
  displayParameters: modules.fields.displayParameters.fields,
  recommendationParameters: modules.fields.recommendationParameters?.fields,
})

export const adaptExclusivityModule = (modules: ExclusivityNatifModule): ExclusivityModule => {
  return {
    id: modules.sys.id,
    title: modules.fields.title,
    alt: modules.fields.alt,
    image: buildImageUrl(modules.fields.image?.fields.file.url),
    url: modules.fields.url,
    displayParameters: modules.fields.displayParameters?.fields,
    offerId: formatOfferIdToNumber(modules.fields.offerId),
  }
}
