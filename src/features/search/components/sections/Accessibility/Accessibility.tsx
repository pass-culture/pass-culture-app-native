import React from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'

const isAudioDisabilityCompliant = true
const isVisualDisabilityCompliant = true
const isMentalDisabilityCompliant = true
const isMotorDisabilityCompliant = true

enum HandicapEnum {
  'VISUAL' = 'handicap visuel',
  'MENTAL' = 'handicap psychique ou cognitif',
  'MOTOR' = 'handicap moteur',
  'AUDIO' = 'handicap auditif',
}

export const Accessibility = () => {
  const disabilities = [
    { compliant: isAudioDisabilityCompliant, label: HandicapEnum.AUDIO },
    { compliant: isVisualDisabilityCompliant, label: HandicapEnum.VISUAL },
    { compliant: isMentalDisabilityCompliant, label: HandicapEnum.MENTAL },
    { compliant: isMotorDisabilityCompliant, label: HandicapEnum.MOTOR },
  ]
  const description = disabilities
    .filter((disability) => disability.compliant)
    .map((disability) => disability.label)
    .join(', ')
  const descriptionWithFirstLetterCapitalized = description[0].toUpperCase() + description.slice(1)

  return (
    <FilterRow
      icon={HandicapMental}
      title="Accessibilité"
      description={descriptionWithFirstLetterCapitalized}
      onPress={() => ({})}
    />
  )
}
