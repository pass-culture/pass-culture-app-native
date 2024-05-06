import { DisabilitiesProperties } from 'features/accessibility/types'
import { Venue } from 'features/venue/types'
import { VenuesFacets } from 'libs/algolia/enums/facetsEnums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { FiltersArray } from 'libs/algolia/types'

export const buildVenueSearchParameters = (
  buildLocationParameterParams: BuildLocationParameterParams,
  disabilitiesProperties?: DisabilitiesProperties,
  venue?: Venue
) => {
  const facetFilters: FiltersArray = []
  if (disabilitiesProperties) {
    if (disabilitiesProperties.isAudioDisabilityCompliant) {
      facetFilters.push([`${VenuesFacets.VENUE_AUDIO_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isMentalDisabilityCompliant) {
      facetFilters.push([`${VenuesFacets.VENUE_MENTAL_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isMotorDisabilityCompliant) {
      facetFilters.push([`${VenuesFacets.VENUE_MOTOR_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isVisualDisabilityCompliant) {
      facetFilters.push([`${VenuesFacets.VENUE_VISUAL_DISABILITY_COMPLIANT}:true`])
    }
  }
  if (facetFilters.length > 0)
    return { facetFilters, ...buildSearchVenuePosition(buildLocationParameterParams, venue) }
  return { ...buildSearchVenuePosition(buildLocationParameterParams, venue) }
}
