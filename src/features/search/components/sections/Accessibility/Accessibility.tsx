import React from 'react'

import { AccessibilityFiltersModal } from 'features/accessibility/AccessibilityFiltersModal'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { FilterBehaviour } from 'features/search/enums'
import { useModal } from 'ui/components/modals/useModal'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'

const isAudioDisabilityCompliant = true
const isVisualDisabilityCompliant = true
const isMentalDisabilityCompliant = true
const isMotorDisabilityCompliant = true

export enum HandicapEnum {
  'VISUAL' = 'handicap visuel',
  'MENTAL' = 'handicap psychique ou cognitif',
  'MOTOR' = 'handicap moteur',
  'AUDIO' = 'handicap auditif',
}

type Props = {
  onClose?: VoidFunction
}

export const Accessibility = ({ onClose }: Props) => {
  const { visible, showModal, hideModal } = useModal(false)

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
    <React.Fragment>
      <FilterRow
        icon={HandicapMental}
        title="Accessibilité"
        description={descriptionWithFirstLetterCapitalized}
        onPress={showModal}
      />
      <AccessibilityFiltersModal
        title="Accessibilité"
        accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
        isVisible={visible}
        hideModal={hideModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
