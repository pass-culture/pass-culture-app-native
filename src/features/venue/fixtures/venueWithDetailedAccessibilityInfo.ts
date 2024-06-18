import { VenueResponse } from 'api/gen'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'

export const venueWithDetailedAccessibilityInfo: VenueResponse = {
  ...venueResponseSnap,
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
}
