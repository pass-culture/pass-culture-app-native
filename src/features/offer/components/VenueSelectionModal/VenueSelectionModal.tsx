import React, { useCallback, useState } from 'react'
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
  title: string
  onSubmit: (selectedOfferId: number) => void
  onClosePress: VoidFunction
}

export function VenueSelectionModal({
  isVisible,
  items,
  title,
  onSubmit,
  onClosePress,
}: VenueSelectionModalProps) {
  const { modal } = useTheme()
  const [selectedOffer, setSelectedOffer] = useState<number>()

  const handleSubmit = useCallback(() => {
    /**
     * `selectedOffer` would always be there since submit is disabled otherwise,
     * but TypeScript can't understand this so a check is necessary.
     */
    onSubmit(selectedOffer as number)
  }, [onSubmit, selectedOffer])

  return (
    <AppModal
      title={title}
      visible={isVisible}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIcon={Close}
      onRightIconPress={onClosePress}
      rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
      fixedModalBottom={
        <BottomWrapper>
          <ButtonPrimary
            wording="Choisir ce lieu"
            onPress={handleSubmit}
            disabled={!selectedOffer}
          />
        </BottomWrapper>
      }>
      <VenueSelectionList
        onItemSelect={setSelectedOffer}
        items={items}
        selectedItem={selectedOffer}
      />
    </AppModal>
  )
}

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: getSpacing(4),
  paddingHorizontal: theme.modal.spacing.MD,
}))
