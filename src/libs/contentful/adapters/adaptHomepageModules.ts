import {
  BusinessModule,
  ExclusivityModule,
  RecommendedOffersModule,
  VenuesModule,
  OffersModule,
  HomepageModule,
} from 'features/home/types'
import {
  BusinessNatifModule,
  ExclusivityNatifModule,
  RecommendationNatifModule,
  VenuesNatifModule,
  AlgoliaNatifModule,
  AlgoliaParameters,
  isAlgoliaNatifModule,
  HomepageNatifModule,
  isBusinessNatifModule,
  isRecommendationNatifModule,
  isVenuesNatifModule,
  isExclusivityNatifModule,
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

export const adaptHomepageNatifModules = (modules: HomepageNatifModule[]): HomepageModule[] => {
  const adaptedHomepageNatifModules = modules.map((module) => {
    const { fields } = module
    if (!fields || !hasAtLeastOneField(fields)) return null

    if (isAlgoliaNatifModule(module)) {
      return adaptOffersModule(module)
    }
    if (isBusinessNatifModule(module)) {
      return adaptBusinessModule(module)
    }
    if (isRecommendationNatifModule(module)) {
      return adaptRecommendationModule(module)
    }
    if (isVenuesNatifModule(module)) {
      return adaptVenuesModule(module)
    }
    if (isExclusivityNatifModule(module)) {
      return adaptExclusivityModule(module)
    }
    return null
  })

  const adaptedHomepageNatifModulesWithoutNull = adaptedHomepageNatifModules.filter(
    (module) => module != null
  ) as HomepageModule[]

  return adaptedHomepageNatifModulesWithoutNull
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

const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .filter((params) => params.fields && hasAtLeastOneField(params.fields))
    .map(({ fields }) => fields)

export const adaptOffersModule = (modules: AlgoliaNatifModule): OffersModule | null => {
  const additionalAlgoliaParameters = modules.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(
    modules.fields.algoliaParameters,
    additionalAlgoliaParameters
  )

  if (offersList.length === 0) return null

  const coverUrl = modules.fields.cover
    ? buildImageUrl(modules.fields.cover.fields.image?.fields.file.url)
    : undefined

  return {
    id: modules.sys.id,
    title: modules.fields.title,
    displayParameters: modules.fields.displayParameters.fields,
    offersModuleParameters: offersList,
    cover: coverUrl,
  }
}
