import { Venue, VenuesParameters } from 'features/home/types'
import { LocationType } from 'features/search/enums'
import { AlgoliaVenue, FiltersArray } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptGeolocationParameters } from 'libs/algolia/fetchAlgolia/helpers/adaptGeolocationParameters'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { VenueTypeCode } from 'libs/parsers'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const fetchVenuesModules = async (
  paramsList: VenuesParameters[],
  userLocation: Position
): Promise<Venue[][]> => {
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
    const algoliaVenuesList = allResults.results.map(({ hits: hit }) => hit)
    return algoliaVenuesList.map((algoliaVenues) => algoliaVenues.map(buildVenue))
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Venue[][]
  }
}

export const buildVenuesQueryOptions = (params: VenuesParameters, userLocation: Position) => {
  const { aroundRadius, isGeolocated, tags = [], venueTypes = [] } = params

  const locationFilter = adaptGeolocationParameters(userLocation, isGeolocated, aroundRadius) ?? {
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

const buildVenue = (venue: AlgoliaVenue): Venue => {
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
    bannerUrl: venue.banner_url ?? undefined,
    contact: {
      email: venue.email ?? undefined,
      phoneNumber: venue.phone_number ?? undefined,
      website: venue.website ?? undefined,
      socialMedias,
    },
    description: venue.description,
    id: parseInt(venue.objectID),
    latitude: venue._geoloc.lat ?? undefined,
    longitude: venue._geoloc.lng ?? undefined,
    name: venue.name,
    publicName: venue.name,
    venueTypeCode: venue.venue_type as VenueTypeCode,
  }
}
