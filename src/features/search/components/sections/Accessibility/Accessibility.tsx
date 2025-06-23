import React from 'react'

import { AccessibilityFiltersModal } from 'features/accessibility/components/AccessibilityFiltersModal'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { HandicapEnum, DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { FilterBehaviour } from 'features/search/enums'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { useModal } from 'ui/components/modals/useModal'
import { VenueAccessibility } from 'ui/svg/icons/VenueAccessibility'

type Props = {
  onClose?: VoidFunction
}

export const Accessibility = ({ onClose }: Props) => {
  const { visible, showModal, hideModal } = useModal(false)

  const { disabilities } = useAccessibilityFiltersContext()

  const disabilitiesList = [
    { compliant: disabilities[DisplayedDisabilitiesEnum.AUDIO], label: HandicapEnum.AUDIO },
    { compliant: disabilities[DisplayedDisabilitiesEnum.VISUAL], label: HandicapEnum.VISUAL },
    { compliant: disabilities[DisplayedDisabilitiesEnum.MENTAL], label: HandicapEnum.MENTAL },
    { compliant: disabilities[DisplayedDisabilitiesEnum.MOTOR], label: HandicapEnum.MOTOR },
  ]

  const description = disabilitiesList
    .filter((disability) => disability.compliant)
    .map((disability) => disability.label)
    .join(', ')

  return (
    <React.Fragment>
      <FilterRow
        icon={VenueAccessibility}
        title="Accessibilité"
        description={capitalizeFirstLetter(description)}
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
