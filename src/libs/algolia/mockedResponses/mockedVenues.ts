import { VenueTypeCodeKey } from 'api/gen'
import { VenueHit } from 'libs/search'

interface SearchResponse {
  hits: VenueHit[]
  nbHits: number
}

export const mockVenues: SearchResponse = {
  hits: [
    {
      id: 5543,
      name: 'Le Petit Rintintin 1',
      venueTypeCode: VenueTypeCodeKey.MOVIE,
      publicName: 'Librairie Quantique',
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibility: {
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
      },
      contact: {
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        socialMedias: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
          snapchat: 'https://snapchat.com',
        },
      },
    },
    {
      id: 5544,
      name: 'Le Petit Rintintin 2',
      venueTypeCode: VenueTypeCodeKey.MOVIE,
      publicName: 'Librairie Quantique',
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibility: {
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
      },
      contact: {
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        socialMedias: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
          snapchat: 'https://snapchat.com',
        },
      },
    },
    {
      id: 5545,
      name: 'Le Petit Rintintin 3',
      venueTypeCode: VenueTypeCodeKey.MOVIE,
      publicName: 'Librairie Quantique',
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibility: {
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
      },
      contact: {
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        socialMedias: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
          snapchat: 'https://snapchat.com',
        },
      },
    },
    {
      id: 5546,
      name: 'Le Petit Rintintin 4',
      venueTypeCode: VenueTypeCodeKey.MOVIE,
      publicName: 'Librairie Quantique',
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibility: {
        audioDisability: false,
        mentalDisability: false,
        motorDisability: false,
        visualDisability: true,
      },
      contact: {
        email: 'contact@venue.com',
        phoneNumber: '+33102030405',
        website: 'https://my@website.com',
        socialMedias: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
          snapchat: 'https://snapchat.com',
        },
      },
    },
  ],
  nbHits: 4,
}
