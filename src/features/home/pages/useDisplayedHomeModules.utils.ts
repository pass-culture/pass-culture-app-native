import { OfferResponse } from 'api/gen'
import {
  BusinessPane,
  ExclusivityPane,
  Offers,
  OffersWithCover,
  VenuesModule,
} from 'features/home/contentful'
import { ProcessedModule } from 'features/home/contentful/moduleTypes'
import { HomeVenuesModuleResponse } from 'features/home/pages/useHomeVenueModules'
import { isArrayOfOfferTypeguard, isArrayOfVenuesTypeguard } from 'features/home/typeguards'
import { GeoCoordinates } from 'libs/geolocation'
import { computeDistanceInMeters } from 'libs/parsers'
import { SearchHit } from 'libs/search'

import { RecommendationPane } from '../contentful/moduleTypes'

import { HomeModuleResponse } from './useHomeModules'

export const showBusinessModule = (
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean
): boolean => {
  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly) return true
  return false
}

export const getOfferModules = (modules: ProcessedModule[]): Array<Offers | OffersWithCover> => {
  const filteredModules = modules.filter(
    (module) => module instanceof Offers || module instanceof OffersWithCover
  )
  return isArrayOfOfferTypeguard(filteredModules) ? filteredModules : []
}

export const getVenueModules = (modules: ProcessedModule[]): Array<VenuesModule> => {
  const filteredModules = modules.filter((module) => module instanceof VenuesModule)
  return isArrayOfVenuesTypeguard(filteredModules) ? filteredModules : []
}

export const getRecommendationModule = (
  modules: ProcessedModule[]
): RecommendationPane | undefined =>
  modules.find((module) => module instanceof RecommendationPane) as RecommendationPane | undefined

export const getExcluModules = (modules: ProcessedModule[]): ExclusivityPane[] =>
  modules.filter((module) => module instanceof ExclusivityPane) as ExclusivityPane[]

export const shouldDisplayExcluOffer = (
  display: ExclusivityPane['display'],
  offer: OfferResponse,
  userLocation: GeoCoordinates | null
): boolean => {
  // Exclu module is not geolocated
  if (!display || !display.isGeolocated || !display.aroundRadius) return true

  // Exclu module is geolocated but we don't know the user's location
  if (!userLocation) return false

  // Exclu module is geolocated and we know the user's location: compute distance to offer
  const { latitude, longitude } = offer.venue.coordinates
  if (!latitude || !longitude) return false
  const distance = computeDistanceInMeters(
    latitude,
    longitude,
    userLocation.latitude,
    userLocation.longitude
  )

  return distance <= 1000 * display.aroundRadius
}

export const getModulesToDisplay = (
  modules: ProcessedModule[],
  homeModules: HomeModuleResponse,
  homeVenuesModules: HomeVenuesModuleResponse,
  recommendedHits: SearchHit[],
  excluOffers: OfferResponse[],
  isLoggedIn: boolean,
  userLocation: GeoCoordinates | null
) =>
  modules.filter((module: ProcessedModule): boolean => {
    if (module instanceof BusinessPane) {
      return showBusinessModule(module.targetNotConnectedUsersOnly, isLoggedIn)
    }

    if (module instanceof ExclusivityPane) {
      const offer = excluOffers.find((offer) => offer.id === module.id)
      return !!offer && shouldDisplayExcluOffer(module.display, offer, userLocation)
    }

    if (module instanceof RecommendationPane) {
      return recommendedHits.length > module.display.minOffers
    }

    if (module.moduleId in homeModules) {
      const { hits, nbHits } = homeModules[module.moduleId]
      return hits.length > 0 && nbHits >= module.display.minOffers
    }

    if (module.moduleId in homeVenuesModules) {
      const { hits, nbHits } = homeVenuesModules[module.moduleId]
      return hits.length > 0 && nbHits >= module.display.minOffers
    }

    return false
  })
