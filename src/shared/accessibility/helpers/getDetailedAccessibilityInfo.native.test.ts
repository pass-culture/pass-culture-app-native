import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

import { getDetailedAccessibilityInfo } from './getDetailedAccessibilityInfo'

describe('getDetailedAccessibilityInfo', () => {
  it('should return detailed info for audio disability', () => {
    const result = getDetailedAccessibilityInfo(venueDataTest.externalAccessibilityData)

    const audioDisabilityInfo = result[0]

    expect(audioDisabilityInfo).toEqual({
      category: 'Handicap auditif',
      description: {
        'Équipement sourd & malentendant': [
          'Boucle à induction magnétique portative',
          'Autre système non renseigné',
        ],
      },
      icon: HandicapAudio,
      isAccessible: false,
    })
  })

  it('should return detailed info for mental disability', () => {
    const result = getDetailedAccessibilityInfo(venueDataTest.externalAccessibilityData)

    const mentalDisabilityInfo = result[1]

    expect(mentalDisabilityInfo).toEqual({
      category: 'Handicap psychique ou cognitif',
      description: { Personnel: 'Personnel formé' },
      icon: HandicapMental,
      isAccessible: true,
    })
  })

  it('should return detailed info for motor disability', () => {
    const result = getDetailedAccessibilityInfo(venueDataTest.externalAccessibilityData)

    const motorDisabilityInfo = result[2]

    expect(motorDisabilityInfo).toEqual({
      category: 'Handicap moteur',
      description: {
        'Accès exterieur': 'Non renseigné',
        'Entrée du bâtiment': 'Non renseigné',
        Sanitaire: 'Sanitaire non adapté',
        Stationnement: 'Pas de stationnement adapté à proximité',
      },
      icon: HandicapMotor,
      isAccessible: false,
    })
  })

  it('should return detailed info for visual disability', () => {
    const result = getDetailedAccessibilityInfo(venueDataTest.externalAccessibilityData)

    const visualDisabilityInfo = result[3]

    expect(visualDisabilityInfo).toEqual({
      category: 'Handicap visuel',
      description: {
        Audiodescription: ['Non renseigné'],
        'Balise sonore': 'Non renseigné',
      },
      icon: HandicapVisual,
      isAccessible: false,
    })
  })
})
