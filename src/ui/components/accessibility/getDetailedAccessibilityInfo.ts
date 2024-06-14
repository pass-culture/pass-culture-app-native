import {
  AudioDisabilityModel,
  ExternalAccessibilityDataModel,
  MentalDisabilityModel,
  MotorDisabilityModel,
  VisualDisabilityModel,
} from 'api/gen'
import {
  getAccessibilityCategoryAndIcon,
  HandicapCategory,
} from 'ui/components/accessibility/getAccessibilityCategoryAndIcon'

const descriptionTranslations: Record<string, string> = {
  facilities: 'Sanitaire',
  exterior: 'Accès exterieur',
  entrance: 'Entrée du bâtiment',
  parking: 'Stationnement',
  audioDescription: 'Audiodescription',
  soundBeacon: 'Balise sonore',
  deafAndHardOfHearing: 'Équipement sourd & malentendant',
  trainedPersonnel: 'Personnel',
}

type DisabilityModel =
  | AudioDisabilityModel
  | MentalDisabilityModel
  | MotorDisabilityModel
  | VisualDisabilityModel

const translateDescriptions = (descriptions?: DisabilityModel) => {
  if (descriptions) {
    return Object.fromEntries(
      Object.entries(descriptions).map(([key, value]) => [
        descriptionTranslations[key] || key,
        value,
      ])
    )
  }
  return 'Information non disponible'
}

export const getDetailedAccessibilityInfo = (data: ExternalAccessibilityDataModel) => [
  {
    isAccessible: data.isAccessibleAudioDisability,
    category: getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO).wording,
    icon: getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO).Icon,
    description: translateDescriptions(data.audioDisability),
  },
  {
    isAccessible: data.isAccessibleMentalDisability,
    category: getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL).wording,
    icon: getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL).Icon,
    description: translateDescriptions(data.mentalDisability),
  },
  {
    isAccessible: data.isAccessibleMotorDisability,
    category: getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR).wording,
    icon: getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR).Icon,
    description: translateDescriptions(data.motorDisability),
  },
  {
    isAccessible: data.isAccessibleVisualDisability,
    category: getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL).wording,
    icon: getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL).Icon,
    description: translateDescriptions(data.visualDisability),
  },
]
