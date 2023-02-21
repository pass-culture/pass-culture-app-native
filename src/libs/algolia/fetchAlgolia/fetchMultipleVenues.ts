import flatten from 'lodash/flatten'

import { LocationType } from 'features/search/enums'
import { AlgoliaVenue, FiltersArray } from 'libs/algolia'
import { VenueHit } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptGeolocationParameters } from 'libs/algolia/fetchAlgolia/helpers/adaptGeolocationParameters'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { VenuesParametersFields } from 'libs/contentful'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { VenueTypeCode } from 'libs/parsers'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

// Used for the venue playlists on the homepage
export const fetchMultipleVenues = async (
  paramsList: VenuesParametersFields[],
  userLocation: GeoCoordinates | null
): Promise<VenueHit[]> => {
  const queries = paramsList.map((params) => ({
    indexName: env.ALGOLIA_VENUES_INDEX_NAME,
    query: '',
    params: {
      ...buildVenuesQueryOptions(params, userLocation),
      ...buildHitsPerPage(params.hitsPerPage),
      attributesToHighlight,
    },
  }))

  try {
    const allResults = await client.multipleQueries<AlgoliaVenue>(queries)
    const hits = flatten(allResults.results.map(({ hits: hit }) => hit))
    return hits.map(buildVenueHit)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as VenueHit[]
  }
}

export const buildVenuesQueryOptions = (
  params: VenuesParametersFields,
  userLocation: GeoCoordinates | null
) => {
  const { aroundRadius, isGeolocated, tags = [], venueTypes = [] } = params

  const locationFilter = adaptGeolocationParameters(userLocation, isGeolocated, aroundRadius) || {
    locationType: LocationType.EVERYWHERE,
  }

  const facetFilters: FiltersArray = []

  if (tags.length) {
    const tagsPredicate = buildTagsPredicate(tags)
    facetFilters.push(tagsPredicate)
  }

  if (venueTypes.length) {
    const venueTypesPredicate = buildVenueTypesPredicate(venueTypes.map(getVenueTypeFacetFilters))
    facetFilters.push(venueTypesPredicate)
  }

  // We want to show on home page only venues that have at least one offer that is searchable in algolia
  const hasAtLeastOneBookableOfferPredicate = [
    `${VenuesFacets.has_at_least_one_bookable_offer}:true`,
  ]
  facetFilters.push(hasAtLeastOneBookableOfferPredicate)

  return {
    ...buildGeolocationParameter(locationFilter, userLocation),
    ...(facetFilters.length > 0 ? { facetFilters } : {}),
  }
}

const buildVenueTypesPredicate = (venueTypes: string[]): string[] =>
  venueTypes.map((venueType) => `${VenuesFacets.venue_type}:${venueType}`)

const buildTagsPredicate = (tags: string[]): string[] =>
  tags.map((tag: string) => `${VenuesFacets.tags}:${tag}`)

const buildVenueHit = (venue: AlgoliaVenue): VenueHit => {
  const socialMedias: Record<string, string> = {}
  if (venue.facebook) socialMedias[venue.facebook] = venue.facebook
  if (venue.instagram) socialMedias[venue.instagram] = venue.instagram
  if (venue.twitter) socialMedias[venue.twitter] = venue.twitter
  if (venue.snapchat) socialMedias[venue.snapchat] = venue.snapchat

  return {
    accessibility: {
      audioDisability: venue.audio_disability,
      mentalDisability: venue.mental_disability,
      motorDisability: venue.motor_disability,
      visualDisability: venue.visual_disability,
    },
    bannerUrl: venue.banner_url || undefined,
    contact: {
      email: venue.email || undefined,
      phoneNumber: venue.phone_number || undefined,
      website: venue.website || undefined,
      socialMedias,
    },
    description: venue.description,
    id: parseInt(venue.objectID),
    latitude: venue._geoloc.lat,
    longitude: venue._geoloc.lng,
    name: venue.name,
    publicName: venue.name,
    venueTypeCode: venue.venue_type as VenueTypeCode,
  }
}
