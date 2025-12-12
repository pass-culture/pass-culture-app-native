import { DisabilitiesProperties } from 'features/accessibility/types'
import { Venue } from 'features/venue/types'
import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { FiltersArray } from 'libs/algolia/types'

export const buildVenueSearchParameters = (
  buildLocationParameterParams: BuildLocationParameterParams,
  disabilitiesProperties?: DisabilitiesProperties,
  venue?: Venue
) => {
  const facetFilters: FiltersArray = [[`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:false`]]
  if (disabilitiesProperties) {
    if (disabilitiesProperties.isAudioDisabilityCompliant) {
      facetFilters.push([`${VENUES_FACETS_ENUM.VENUE_AUDIO_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isMentalDisabilityCompliant) {
      facetFilters.push([`${VENUES_FACETS_ENUM.VENUE_MENTAL_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isMotorDisabilityCompliant) {
      facetFilters.push([`${VENUES_FACETS_ENUM.VENUE_MOTOR_DISABILITY_COMPLIANT}:true`])
    }
    if (disabilitiesProperties.isVisualDisabilityCompliant) {
      facetFilters.push([`${VENUES_FACETS_ENUM.VENUE_VISUAL_DISABILITY_COMPLIANT}:true`])
    }
  }
  if (facetFilters.length > 0)
    return { facetFilters, ...buildSearchVenuePosition(buildLocationParameterParams, venue) }
  return { ...buildSearchVenuePosition(buildLocationParameterParams, venue) }
}
