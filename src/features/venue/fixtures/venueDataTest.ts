import { Activity, VenueResponse } from 'api/gen'

export const venueDataTest: Omit<VenueResponse, 'isVirtual'> = {
  accessibility: {
    audioDisability: false,
    mentalDisability: false,
    motorDisability: false,
    visualDisability: true,
  },
  address: '1 boulevard Poissonnière',
  city: 'Paris',
  contact: {
    email: 'contact@venue.com',
    phoneNumber: '+33102030405',
    website: 'https://my@website.com',
  },
  description:
    'https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,',
  externalAccessibilityData: {
    isAccessibleAudioDisability: false,
    isAccessibleMentalDisability: true,
    isAccessibleMotorDisability: false,
    isAccessibleVisualDisability: false,
    audioDisability: {
      deafAndHardOfHearing: [
        'Boucle à induction magnétique portative',
        'Autre système non renseigné',
      ],
    },
    mentalDisability: {
      trainedPersonnel: 'Personnel formé',
    },
    motorDisability: {
      facilities: 'Sanitaire non adapté',
      exterior: 'Non renseigné',
      entrance: 'Non renseigné',
      parking: 'Pas de stationnement adapté à proximité',
    },
    visualDisability: {
      soundBeacon: 'Non renseigné',
      audioDescription: ['Non renseigné'],
    },
  },
  externalAccessibilityId: 'slug-d-accessibilite-1',
  externalAccessibilityUrl: 'https://site-d-accessibilite.com/erps/slug-d-accessibilite-1/',
  id: 5543,
  isPermanent: true,
  isOpenToPublic: true,
  latitude: 48.87004,
  longitude: 2.3785,
  name: 'Le Petit Rintintin 1',
  openingHours: {
    MONDAY: [{ open: '09:00', close: '19:00' }],
    TUESDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    WEDNESDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    THURSDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    FRIDAY: [{ open: '09:00', close: '19:00' }],
    SATURDAY: undefined,
    SUNDAY: undefined,
  },
  postalCode: '75000',
  publicName: 'Le Petit Rintintin 1',
  activity: Activity.BOOKSTORE,
  withdrawalDetails: 'How to withdraw, https://test.com',
  timezone: 'UTC',
}
