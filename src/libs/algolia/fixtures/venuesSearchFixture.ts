import type { ReadonlyDeep } from 'type-fest'

import { Activity } from 'api/gen'
import { VenueHit } from 'libs/algolia/types'
import { toMutable } from 'shared/types/toMutable'

interface SearchResponse {
  hits: VenueHit[]
  nbHits: number
}

export const venuesSearchFixture = toMutable({
  hits: [
    {
      id: 5543,
      name: 'Le Petit Rintintin 1',
      activity: Activity.CINEMA,
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibilityData: {
        isAccessibleAudioDisability: false,
        isAccessibleMentalDisability: false,
        isAccessibleMotorDisability: false,
        isAccessibleVisualDisability: true,
        audioDisability: { deafAndHardOfHearing: [] },
        mentalDisability: { trainedPersonnel: '' },
        motorDisability: { entrance: '', exterior: '', facilities: '', parking: '' },
        visualDisability: { audioDescription: [], soundBeacon: '' },
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
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA',
      postalCode: '75000',
      city: 'Paris',
      isOpenToPublic: true,
      isPermanent: true,
    },
    {
      id: 5544,
      name: 'Le Petit Rintintin 2',
      activity: Activity.CINEMA,
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibilityData: {
        isAccessibleAudioDisability: false,
        isAccessibleMentalDisability: false,
        isAccessibleMotorDisability: false,
        isAccessibleVisualDisability: true,
        audioDisability: { deafAndHardOfHearing: [] },
        mentalDisability: { trainedPersonnel: '' },
        motorDisability: { entrance: '', exterior: '', facilities: '', parking: '' },
        visualDisability: { audioDescription: [], soundBeacon: '' },
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
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA',
      postalCode: '75000',
      city: 'Paris',
      isOpenToPublic: true,
      isPermanent: true,
    },
    {
      id: 5545,
      name: 'Le Petit Rintintin 3',
      activity: Activity.CINEMA,
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibilityData: {
        isAccessibleAudioDisability: false,
        isAccessibleMentalDisability: false,
        isAccessibleMotorDisability: false,
        isAccessibleVisualDisability: true,
        audioDisability: { deafAndHardOfHearing: [] },
        mentalDisability: { trainedPersonnel: '' },
        motorDisability: { entrance: '', exterior: '', facilities: '', parking: '' },
        visualDisability: { audioDescription: [], soundBeacon: '' },
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
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA',
      postalCode: '75000',
      city: 'Paris',
      isOpenToPublic: true,
      isPermanent: true,
    },
    {
      id: 5546,
      name: 'Le Petit Rintintin 4',
      activity: Activity.CINEMA,
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibilityData: {
        isAccessibleAudioDisability: false,
        isAccessibleMentalDisability: false,
        isAccessibleMotorDisability: false,
        isAccessibleVisualDisability: true,
        audioDisability: { deafAndHardOfHearing: [] },
        mentalDisability: { trainedPersonnel: '' },
        motorDisability: { entrance: '', exterior: '', facilities: '', parking: '' },
        visualDisability: { audioDescription: [], soundBeacon: '' },
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
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA',
      postalCode: '75000',
      city: 'Paris',
      isOpenToPublic: true,
      isPermanent: true,
    },
    {
      id: 5547,
      name: 'Le Petit Rintintin 5',
      activity: Activity.CINEMA,
      latitude: 48.87004,
      longitude: 2.3785,
      description: ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit.',
      accessibilityData: {
        isAccessibleAudioDisability: false,
        isAccessibleMentalDisability: false,
        isAccessibleMotorDisability: false,
        isAccessibleVisualDisability: true,
        audioDisability: { deafAndHardOfHearing: [] },
        mentalDisability: { trainedPersonnel: '' },
        motorDisability: { entrance: '', exterior: '', facilities: '', parking: '' },
        visualDisability: { audioDescription: [], soundBeacon: '' },
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
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA',
      postalCode: '75000',
      city: 'Paris',
      isOpenToPublic: true,
      isPermanent: true,
    },
  ],
  nbHits: 5,
} as const satisfies ReadonlyDeep<SearchResponse>)
