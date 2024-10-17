import isEqual from 'lodash/isEqual'
import React, { useState, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  useAccessibilityFiltersContext,
  defaultDisabilitiesProperties,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { HandicapEnum, DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { DisabilitiesProperties } from 'features/accessibility/types'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { AppModal } from 'ui/components/modals/AppModal'
import { Ul } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

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
  }

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  const handleOnPress = (disability: string) => {
    setDisplayedDisabilities({
      ...displayedDisabilities,
      // @ts-expect-error: because of noUncheckedIndexedAccess
      [disability]: !displayedDisabilities[disability],
    })
  }

  const handleSubmit = () => {
    setDisabilities(displayedDisabilities)
    hideModal()
  }

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
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <AccessibilityFiltersContainer>
        <TypoDS.BodyAccent>
          Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps
        </TypoDS.BodyAccent>
        <StyledCheckBox>
          <Checkbox
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.VISUAL]}
            label={capitalizeFirstLetter(HandicapEnum.VISUAL)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.VISUAL)}
          />
          <Checkbox
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.MENTAL]}
            label={capitalizeFirstLetter(HandicapEnum.MENTAL)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.MENTAL)}
          />
          <Checkbox
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.MOTOR]}
            label={capitalizeFirstLetter(HandicapEnum.MOTOR)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.MOTOR)}
          />
          <Checkbox
            isChecked={!!displayedDisabilities?.[DisplayedDisabilitiesEnum.AUDIO]}
            label={capitalizeFirstLetter(HandicapEnum.AUDIO)}
            onPress={() => handleOnPress(DisplayedDisabilitiesEnum.AUDIO)}
          />
        </StyledCheckBox>
      </AccessibilityFiltersContainer>
    </AppModal>
  )
}

const AccessibilityFiltersContainer = styled.View({
  gap: getSpacing(8),
})

const StyledCheckBox = styled(Ul)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: getSpacing(6),
})
