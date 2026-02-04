import { Venue, VenuesModuleParameters } from 'features/home/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildVenuesModulesQueries } from 'libs/algolia/fetchAlgolia/helpers/buildVenuesModulesQueries'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { AlgoliaVenue } from 'libs/algolia/types'

export const fetchVenuesModules = async (
  paramsList: (VenuesModuleParameters & BuildLocationParameterParams)[]
): Promise<Venue[][]> => {
  const queries = buildVenuesModulesQueries({ paramsList })

  try {
    const results = await multipleQueries<AlgoliaVenue>(queries)
    const searchResponseResults = results.filter(searchResponsePredicate)
    const algoliaVenuesList = searchResponseResults.map(({ hits: hit }) => hit)
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
      isAccessibleAudioDisability: venue.audio_disability ?? undefined,
      isAccessibleMentalDisability: venue.mental_disability ?? undefined,
      isAccessibleMotorDisability: venue.motor_disability ?? undefined,
      isAccessibleVisualDisability: venue.visual_disability ?? undefined,
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
    activity: venue.activity,
    city: venue.city,
    postalCode: venue.postalCode,
  }
}
