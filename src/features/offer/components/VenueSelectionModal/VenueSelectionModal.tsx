import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import {
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

type VenueSelectionModalProps = {
  isVisible: boolean
  items: VenueSelectionListProps['items']
  onItemSelect: (itemOfferId: string) => void
  onSubmit: VoidFunction
  selectedItem?: string
  onClosePress: VoidFunction
}

export function VenueSelectionModal({
  isVisible,
  items,
  selectedItem,
  onItemSelect,
  onSubmit,
  onClosePress,
}: VenueSelectionModalProps) {
  const { modal } = useTheme()
  return (
    <AppModal
      title="Lieu de retrait"
      visible={isVisible}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIcon={Close}
      onRightIconPress={onClosePress}
      rightIconAccessibilityLabel="Annuler le choix de lieu"
      fixedModalBottom={
        <BottomWrapper>
          <ButtonPrimary wording="Choisir ce lieu" onPress={onSubmit} disabled={!selectedItem} />
        </BottomWrapper>
      }>
      <VenueSelectionList onItemSelect={onItemSelect} items={items} selectedItem={selectedItem} />
    </AppModal>
  )
}

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: getSpacing(4),
  paddingHorizontal: theme.modal.spacing.MD,
}))
