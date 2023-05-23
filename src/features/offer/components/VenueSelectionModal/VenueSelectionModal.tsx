import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Coordinates } from 'api/gen'
import {
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type VenueSelectionModalProps = {
  isVisible: boolean
  items: VenueSelectionListProps['items']
  title: string
  onSubmit: (selectedOfferId: number) => void
  onClosePress: VoidFunction
  onEndReached?: () => Promise<void>
  refreshing?: boolean
  onRefresh?: (() => void) | null
  offerVenueLocation?: Coordinates
  onScroll?: VoidFunction
}

const HEIGHT_CONTAINER = getSpacing(6)

export function VenueSelectionModal({
  isVisible,
  items,
  title,
  onSubmit,
  onClosePress,
  onEndReached,
  refreshing,
  onRefresh,
  onScroll,
  offerVenueLocation,
}: VenueSelectionModalProps) {
  const [selectedOffer, setSelectedOffer] = useState<number>()
  const { top } = useCustomSafeInsets()

  const handleSubmit = useCallback(() => {
    /**
     * `selectedOffer` would always be there since submit is disabled otherwise,
     * but TypeScript can't understand this so a check is necessary.
     */
    onSubmit(selectedOffer as number)
  }, [onSubmit, selectedOffer])

  const customHeader = useMemo(() => {
    return (
      <HeaderContainer>
        <View style={{ height: HEIGHT_CONTAINER + top }} />
        <ModalHeader
          title={title}
          rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
          rightIcon={Close}
          onRightIconPress={onClosePress}
        />
        <Spacer.Column numberOfSpaces={6} />
      </HeaderContainer>
    )
  }, [onClosePress, title, top])

  return (
    <AppModal
      title={title}
      visible={isVisible}
      isFullscreen
      noPadding
      rightIcon={Close}
      onRightIconPress={onClosePress}
      rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
      customModalHeader={customHeader}
      fixedModalBottom={
        <BottomWrapper>
          <ButtonPrimary
            wording="Choisir ce lieu"
            onPress={handleSubmit}
            disabled={!selectedOffer}
          />
        </BottomWrapper>
      }
      scrollEnabled={false}>
      <VenueSelectionList
        onItemSelect={setSelectedOffer}
        items={items}
        selectedItem={selectedOffer}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={onScroll}
        offerVenueLocation={offerVenueLocation}
      />
    </AppModal>
  )
}

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: getSpacing(4),
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))

const HeaderContainer = styled.View({
  width: '100%',
  paddingHorizontal: getSpacing(6),
})
