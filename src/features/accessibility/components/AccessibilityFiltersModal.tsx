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
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { AppModal } from 'ui/components/modals/AppModal'
import { Ul } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { getSpacing, Typo } from 'ui/theme'

const titleId = uuidv4()

export type AccessibilityModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  onClose?: () => void
  filterBehaviour: FilterBehaviour
}

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

  const handleOnPress = (disability: DisplayedDisabilitiesEnum) => {
    setDisplayedDisabilities({
      ...displayedDisabilities,
      [disability]: !displayedDisabilities[disability],
    })
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
      <AccessibilityFiltersContainer gap={8}>
        <Typo.BodyAccent>
          Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps
        </Typo.BodyAccent>
        <StyledCheckBox>
          <Checkbox
            variant="detailed"
            asset={{ variant: 'icon', Icon: HandicapVisual }}
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.VISUAL]}
            label={capitalizeFirstLetter(HandicapEnum.VISUAL)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.VISUAL)}
          />
          <Checkbox
            variant="detailed"
            asset={{ variant: 'icon', Icon: HandicapMental }}
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.MENTAL]}
            label={capitalizeFirstLetter(HandicapEnum.MENTAL)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.MENTAL)}
          />
          <Checkbox
            variant="detailed"
            asset={{ variant: 'icon', Icon: HandicapMotor }}
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.MOTOR]}
            label={capitalizeFirstLetter(HandicapEnum.MOTOR)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.MOTOR)}
          />
          <Checkbox
            variant="detailed"
            asset={{ variant: 'icon', Icon: HandicapAudio }}
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.AUDIO]}
            label={capitalizeFirstLetter(HandicapEnum.AUDIO)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.AUDIO)}
          />
        </StyledCheckBox>
      </AccessibilityFiltersContainer>
    </AppModal>
  )
}

const AccessibilityFiltersContainer = styled(ViewGap)({
  marginTop: getSpacing(6),
})

const StyledCheckBox = styled(Ul)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: getSpacing(4),
})
