import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { HandicapEnum } from 'features/search/components/sections/Accessibility/Accessibility'
import { FilterBehaviour } from 'features/search/enums'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { Ul } from 'ui/components/Ul'
import { Typo } from 'ui/theme'
import { Spacer } from 'ui/theme'
import { getSpacing } from 'ui/theme/spacing'
const titleId = uuidv4()

export interface AccessibilityModalProps {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: VoidFunction
  onClose?: VoidFunction
  filterBehaviour: FilterBehaviour
}

export interface SelectedHandicapInterface {
  label: string
  isChecked: boolean
}

export const AccessibilityFiltersModal = ({
  title,
  isVisible,
  hideModal,
  onClose,
  filterBehaviour,
}: AccessibilityModalProps) => {
  const { modal } = useTheme()

  const [handicapsList, setHandicapsList] = useState(
    Object.values(HandicapEnum).map((category) => ({
      label: category[0].toUpperCase() + category.slice(1),
      isChecked: false,
    }))
  )

  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  const handleModalClose = useCallback(() => {
    hideModal()
  }, [hideModal])

  const close = useCallback(() => {
    handleModalClose()
    if (onClose) {
      onClose()
    }
  }, [handleModalClose, onClose])

  const handleSelectedHandicaps = (selectedHandicap: SelectedHandicapInterface) => {
    const updatedHandicapsList = handicapsList.map((handicap) => {
      if (selectedHandicap.label === handicap.label) handicap.isChecked = !handicap.isChecked
      return handicap
    })
    setHandicapsList(updatedHandicapsList)
  }

  const handleFilterReset = () => {
    const updatedHandicapsList = handicapsList.map((handicap) => {
      handicap.isChecked = false
      return handicap
    })
    setHandicapsList(updatedHandicapsList)
  }

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={handleModalClose}
          onClose={close}
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
          onResetPress={() => handleFilterReset()}
          onSearchPress={() => ({})}
          isSearchDisabled={false}
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
          {handicapsList.map((handicap) => (
            <Li key={handicap.label}>
              <Checkbox
                isChecked={handicap.isChecked}
                label={handicap.label}
                onPress={() => handleSelectedHandicaps(handicap)}
              />
              <Spacer.Column numberOfSpaces={6} />
            </Li>
          ))}
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
