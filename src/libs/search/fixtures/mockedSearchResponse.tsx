import { VenueTypeCode } from 'api/gen'
import { VenueHit } from 'libs/search'

interface SearchResponse {
  hits: VenueHit[]
  nbHits: number
}

export const mockedSearchResponse: SearchResponse = {
  hits: [
    {
      venue: {
        id: '5543',
        name: 'Le Petit Rintintin 1',
        venueType: VenueTypeCode.MOVIE,
        offererName: 'Librairie Quantique',
        position: {
          latitude: 48.87004,
          longitude: 2.3785,
        },
        description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        snapchat: 'https://snapchat.com',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    },
    {
      venue: {
        id: '5544',
        name: 'Le Petit Rintintin 2',
        venueType: VenueTypeCode.MOVIE,
        offererName: 'Librairie Quantique',
        position: {
          latitude: 48.87004,
          longitude: 2.3785,
        },
        description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        snapchat: 'https://snapchat.com',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    },
    {
      venue: {
        id: '5545',
        name: 'Le Petit Rintintin 3',
        venueType: VenueTypeCode.MOVIE,
        offererName: 'Librairie Quantique',
        position: {
          latitude: 48.87004,
          longitude: 2.3785,
        },
        description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        snapchat: 'https://snapchat.com',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    },
    {
      venue: {
        id: '5546',
        name: 'Le Petit Rintintin 4',
        venueType: VenueTypeCode.MOVIE,
        offererName: 'Librairie Quantique',
        position: {
          latitude: 48.87004,
          longitude: 2.3785,
        },
        description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        snapchat: 'https://snapchat.com',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    },
  ],
  nbHits: 4,
}
