import { isEqual } from 'lodash'
import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisplayedDisabilitiesEnum, HandicapEnum } from 'features/accessibility/enums'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { capitalize } from 'libs/formatter/capitalize'
import { AppModal } from 'ui/components/modals/AppModal'
import { CheckboxGroup } from 'ui/designSystem/CheckboxGroup/CheckboxGroup'
import { CheckboxGroupOption } from 'ui/designSystem/CheckboxGroup/types'
import { Close } from 'ui/svg/icons/Close'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

const titleId = uuidv4()

export type AccessibilityModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  onClose?: () => void
  filterBehaviour: FilterBehaviour
}

const disabilityOptions: CheckboxGroupOption<DisplayedDisabilitiesEnum>[] = [
  {
    label: capitalize(HandicapEnum.VISUAL),
    value: DisplayedDisabilitiesEnum.VISUAL,
    variant: 'detailed',
    asset: { variant: 'icon', Icon: HandicapVisual },
  },
  {
    label: capitalize(HandicapEnum.MENTAL),
    value: DisplayedDisabilitiesEnum.MENTAL,
    variant: 'detailed',
    asset: { variant: 'icon', Icon: HandicapMental },
  },
  {
    label: capitalize(HandicapEnum.MOTOR),
    value: DisplayedDisabilitiesEnum.MOTOR,
    variant: 'detailed',
    asset: { variant: 'icon', Icon: HandicapMotor },
  },
  {
    label: capitalize(HandicapEnum.AUDIO),
    value: DisplayedDisabilitiesEnum.AUDIO,
    variant: 'detailed',
    asset: { variant: 'icon', Icon: HandicapAudio },
  },
]

export const AccessibilityFiltersModal: React.FC<AccessibilityModalProps> = ({
  title,
  isVisible,
  hideModal,
  onClose,
  accessibilityLabel,
  filterBehaviour,
}) => {
  const { modal } = useTheme()
  const { disabilities, setDisabilities } = useAccessibilityFiltersContext()

  const [displayedDisabilities, setDisplayedDisabilities] =
    useState<DisabilitiesProperties>(disabilities)

  useEffect(() => {
    setDisplayedDisabilities(disabilities)
  }, [disabilities])

  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  const handleCloseModal = () => {
    hideModal()
    onClose?.()
    if (!isEqual(disabilities, displayedDisabilities)) setDisplayedDisabilities(disabilities)
  }

  const handleFilterReset = () => {
    setDisplayedDisabilities(defaultDisabilitiesProperties)
    setDisabilities(defaultDisabilitiesProperties)
  }

  const selectedDisabilities = Object.entries(displayedDisabilities)
    .filter(([_, isSelected]) => isSelected)
    .map(([key]) => key)

  const handleOnPress = (newValues: string[]) => {
    const updated: DisabilitiesProperties = {
      [DisplayedDisabilitiesEnum.VISUAL]: newValues.includes(DisplayedDisabilitiesEnum.VISUAL),
      [DisplayedDisabilitiesEnum.MENTAL]: newValues.includes(DisplayedDisabilitiesEnum.MENTAL),
      [DisplayedDisabilitiesEnum.MOTOR]: newValues.includes(DisplayedDisabilitiesEnum.MOTOR),
      [DisplayedDisabilitiesEnum.AUDIO]: newValues.includes(DisplayedDisabilitiesEnum.AUDIO),
    }
    setDisplayedDisabilities(updated)
  }

  const handleSubmit = () => {
    setDisabilities(displayedDisabilities)
    hideModal()
  }

  const hasDefaultValues = isEqual(defaultDisabilitiesProperties, displayedDisabilities)

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={hideModal}
          onClose={handleCloseModal}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={title}
      isUpToStatusBar
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={handleCloseModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onResetPress={handleFilterReset}
          onSearchPress={handleSubmit}
          filterBehaviour={filterBehaviour}
          isResetDisabled={hasDefaultValues}
        />
      }>
      <AccessibilityFiltersContainer>
        <CheckboxGroup<string>
          label="Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps"
          options={disabilityOptions}
          value={selectedDisabilities}
          onChange={handleOnPress}
          variant="detailed"
        />
      </AccessibilityFiltersContainer>
    </AppModal>
  )
}

const AccessibilityFiltersContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
