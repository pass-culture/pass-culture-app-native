import { Venue, VenuesModuleParameters } from 'features/home/types'
import { AlgoliaVenue } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { VenueTypeCode } from 'libs/parsers'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const fetchVenuesModules = async (
  paramsList: VenuesModuleParameters[],
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
