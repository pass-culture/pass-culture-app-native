import {
  AccessibilityData,
  AudioDisability,
  MentalDisability,
  MotorDisability,
  VisualDisability,
} from 'api/gen'
import {
  HandicapCategory,
  getAccessibilityCategoryAndIcon,
} from 'shared/accessibility/getAccessibilityCategoryAndIcon'

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
  | AudioDisability
  | MentalDisability
  | MotorDisability
  | VisualDisability
  | null

const translateDescriptions = (descriptions?: DisabilityModel): Record<string, string> => {
  if (descriptions) {
    return Object.fromEntries(
      Object.entries(descriptions).map(([key, value]) => [
        descriptionTranslations[key] || key,
        value,
      ])
    )
  }
  return { notAvailable: 'Information non disponible' }
}

export const getDetailedAccessibilityInfo = (
  accessibilities: AccessibilityData | null | undefined
) => {
  if (accessibilities)
    return [
      {
        isAccessible: accessibilities.isAccessibleAudioDisability,
        category: getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO).wording,
        icon: getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO).Icon,
        description: translateDescriptions(accessibilities.audioDisability),
      },
      {
        isAccessible: accessibilities.isAccessibleMentalDisability,
        category: getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL).wording,
        icon: getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL).Icon,
        description: translateDescriptions(accessibilities.mentalDisability),
      },
      {
        isAccessible: accessibilities.isAccessibleMotorDisability,
        category: getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR).wording,
        icon: getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR).Icon,
        description: translateDescriptions(accessibilities.motorDisability),
      },
      {
        isAccessible: accessibilities.isAccessibleVisualDisability,
        category: getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL).wording,
        icon: getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL).Icon,
        description: translateDescriptions(accessibilities.visualDisability),
      },
    ]
  return []
}
