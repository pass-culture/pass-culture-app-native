import { ResultItem } from '@elastic/app-search-javascript'

import { VenueTypeCode } from 'api/gen'
import { VenueHit } from 'libs/search'
import { AppSearchVenuesFields, TRUE } from 'libs/search/filters/constants'

export const buildVenueHits = (searchHit: ResultItem<AppSearchVenuesFields>): VenueHit => {
  const geoloc = searchHit.getRaw(AppSearchVenuesFields.position) as string
  const id = searchHit.getRaw(AppSearchVenuesFields.id) as string
  const audioDisability = searchHit.getRaw(AppSearchVenuesFields.audio_disability) as string
  const mentalDisability = searchHit.getRaw(AppSearchVenuesFields.mental_disability) as string
  const motorDisability = searchHit.getRaw(AppSearchVenuesFields.motor_disability) as string
  const visualDisability = searchHit.getRaw(AppSearchVenuesFields.visual_disability) as string

  const [lat, lng] = (geoloc || ',').split(',')

  return {
    accessibility: {
      audioDisability: +audioDisability === TRUE,
      mentalDisability: +mentalDisability === TRUE,
      motorDisability: +motorDisability === TRUE,
      visualDisability: +visualDisability === TRUE,
    },
    contact: {
      email: searchHit.getRaw(AppSearchVenuesFields.email) as string,
      phoneNumber: searchHit.getRaw(AppSearchVenuesFields.phone_number) as string,
      socialMedias: {
        facebook: searchHit.getRaw(AppSearchVenuesFields.facebook) as string,
        twitter: searchHit.getRaw(AppSearchVenuesFields.twitter) as string,
        instagram: searchHit.getRaw(AppSearchVenuesFields.instagram) as string,
        snapchat: searchHit.getRaw(AppSearchVenuesFields.snapchat) as string,
      },
      website: searchHit.getRaw(AppSearchVenuesFields.website) as string,
    },
    description: searchHit.getRaw(AppSearchVenuesFields.description) as string,
    id: parseInt(id),
    latitude: isNaN(parseFloat(lat)) ? null : parseFloat(lat),
    longitude: isNaN(parseFloat(lng)) ? null : parseFloat(lng),
    name: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    publicName: searchHit.getRaw(AppSearchVenuesFields.name) as string,
    venueTypeCode: searchHit.getRaw(AppSearchVenuesFields.venue_type) as VenueTypeCode,
  }
}
