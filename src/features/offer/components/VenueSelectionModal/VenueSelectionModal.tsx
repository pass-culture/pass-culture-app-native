import React, { useCallback, useMemo, useState } from 'react'
import { FlatListProps, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  VenueListItem,
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
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
  onSubmit: (selectedVenueId: number) => void
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
  const [selectedVenue, setSelectedVenue] = useState<number>()
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const { top } = useCustomSafeInsets()
  const { designSystem } = useTheme()
  const {
    permissionState,
    requestGeolocPermission,
    onPressGeolocPermissionModalButton: onPressGeolocPermissionModalButtonDefault,
  } = useLocation()

  const {
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
    visible: isGeolocPermissionModalVisible,
  } = useModal(false)

  const handleSubmit = useCallback(() => {
    if (selectedVenue !== undefined) {
      onSubmit(selectedVenue)
    }
  }, [onSubmit, selectedVenue])

  const onPressGeolocPermissionModalButton = useCallback(() => {
    hideGeolocPermissionModal()
    onPressGeolocPermissionModalButtonDefault()
  }, [hideGeolocPermissionModal, onPressGeolocPermissionModalButtonDefault])

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])
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
          <ButtonPrimary
            wording={validateButtonLabel}
            onPress={handleSubmit}
            disabled={!selectedVenue}
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
        onItemSelect={setSelectedVenue}
        items={items}
        selectedItem={selectedVenue}
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
        onPressGeolocationBanner={onPressGeolocationBanner}
      />
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
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
