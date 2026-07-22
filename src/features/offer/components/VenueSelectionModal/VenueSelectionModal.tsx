import React, { useCallback, useMemo, useState } from 'react'
import { FlatListProps, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  VenueListItem,
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type VenueSelectionModalProps = Pick<
  FlatListProps<VenueListItem>,
  'onRefresh' | 'refreshing' | 'onScroll'
> & {
  isVisible: boolean
  items: VenueSelectionListProps['items']
  nbLoadedHits: number
  nbHits: number
  isFetchingNextPage: boolean
  title: string
  onSubmit: (selectedOfferId: number, selectedVenueId?: number) => void
  onClosePress: VoidFunction
  onEndReached: () => void
  isSharingLocation: boolean
  subTitle: string
  rightIconAccessibilityLabel: string
  validateButtonLabel: string
  headerMessage: string
}

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
  nbLoadedHits,
  nbHits,
  isFetchingNextPage,
  isSharingLocation,
  subTitle,
  rightIconAccessibilityLabel,
  validateButtonLabel,
  headerMessage,
}: VenueSelectionModalProps) {
  const [selectedVenue, setSelectedVenue] = useState<{
    offerId: number
    venueId?: number
  }>()
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const { top } = useCustomSafeInsets()
  const { designSystem } = useTheme()

  const handleSubmit = useCallback(() => {
    if (selectedVenue !== undefined) {
      onSubmit(selectedVenue.offerId, selectedVenue.venueId)
    }
  }, [onSubmit, selectedVenue])

  const HEIGHT_CONTAINER = designSystem.size.spacing.xl

  const customHeader = useMemo(() => {
    return (
      <ModalHeaderContainer>
        <View style={{ height: HEIGHT_CONTAINER + top }} />
        <ModalHeader
          title={title}
          rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
          rightIcon={Close}
          onRightIconPress={onClosePress}
        />
      </ModalHeaderContainer>
    )
  }, [HEIGHT_CONTAINER, onClosePress, title, top])

  return (
    <AppModal
      title={title}
      visible={isVisible}
      isFullscreen
      noPadding
      rightIcon={Close}
      onRightIconPress={onClosePress}
      rightIconAccessibilityLabel={rightIconAccessibilityLabel}
      customModalHeader={customHeader}
      fixedModalBottom={
        <BottomWrapper>
          <Button
            wording={validateButtonLabel}
            onPress={handleSubmit}
            disabled={!selectedVenue}
            fullWidth
          />
        </BottomWrapper>
      }
      scrollEnabled={false}>
      <View>
        <AutoScrollSwitch
          title="Activer le chargement automatique des résultats"
          active={autoScrollEnabled}
          toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
        />
      </View>
      <VenueSelectionList
        onItemSelect={(offerId, venueId) => setSelectedVenue({ offerId, venueId })}
        items={items}
        selectedItem={selectedVenue?.offerId}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={onScroll}
        onPress={onEndReached}
        autoScrollEnabled={autoScrollEnabled}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage={isFetchingNextPage}
        isSharingLocation={isSharingLocation}
        subTitle={subTitle}
        headerMessage={headerMessage}
      />
    </AppModal>
  )
}

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))

const ModalHeaderContainer = styled.View(({ theme }) => ({
  width: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
