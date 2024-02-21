import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { HandicapEnum } from 'features/search/components/sections/Accessibility/Accessibility'
import { FilterBehaviour } from 'features/search/enums'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { AppModal } from 'ui/components/modals/AppModal'
import { Ul } from 'ui/components/Ul'
import { Typo, Spacer, getSpacing } from 'ui/theme'

const titleId = uuidv4()

export type AccessibilityModalProps = {
  title: string
  accessibilityLabel?: string
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
  filterBehaviour,
}) => {
  const { modal } = useTheme()

  const [isVisualHandicapCompliant, setIsVisualHandicapCompliant] = useState<boolean>(false)
  const [isMotorHandicapCompliant, setIsMotorHandicapCompliant] = useState<boolean>(false)
  const [isAudioHandicapCompliant, setIsAudioHandicapCompliant] = useState<boolean>(false)
  const [isMentalHandicapCompliant, setIsMentalHandicapCompliant] = useState<boolean>(false)

  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  const handleCloseModal = () => {
    hideModal()
    onClose?.()
  }

  const handleFilterReset = () => {
    setIsVisualHandicapCompliant(false)
    setIsAudioHandicapCompliant(false)
    setIsMotorHandicapCompliant(false)
    setIsMentalHandicapCompliant(false)
  }

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
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
      fixedModalBottom={
        <SearchFixedModalBottom
          onResetPress={handleFilterReset}
          onSearchPress={() => ({})}
          filterBehaviour={filterBehaviour}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <AccessibilityFiltersContainer>
        <Typo.ButtonText>
          Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps
        </Typo.ButtonText>
        <Spacer.Column numberOfSpaces={8} />
        <StyledCheckBox>
          <Checkbox
            isChecked={isVisualHandicapCompliant}
            label={capitalizeFirstLetter(HandicapEnum.VISUAL)}
            onPress={setIsVisualHandicapCompliant}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Checkbox
            isChecked={isMentalHandicapCompliant}
            label={capitalizeFirstLetter(HandicapEnum.MENTAL)}
            onPress={setIsMentalHandicapCompliant}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Checkbox
            isChecked={isMotorHandicapCompliant}
            label={capitalizeFirstLetter(HandicapEnum.MOTOR)}
            onPress={setIsMotorHandicapCompliant}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Checkbox
            isChecked={isAudioHandicapCompliant}
            label={capitalizeFirstLetter(HandicapEnum.AUDIO)}
            onPress={setIsAudioHandicapCompliant}
          />
        </StyledCheckBox>
      </AccessibilityFiltersContainer>
    </AppModal>
  )
}

const AccessibilityFiltersContainer = styled.View({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(6),
})

const StyledCheckBox = styled(Ul)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})
