import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'
import styled from 'styled-components/native'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import {
  VenueListItem,
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type VenueSelectionModalProps = Pick<
  FlatListProps<VenueListItem>,
  'onRefresh' | 'refreshing' | 'onEndReached' | 'onScroll'
> & {
  isVisible: boolean
  items: VenueSelectionListProps['items']
  nbLoadedHits: number
  nbHits: number
  isFetchingNextPage: boolean
  title: string
  onSubmit: (selectedOfferId: number) => void
  onClosePress: VoidFunction
  onEndReached?: () => void
  venueName?: string
  isSharingLocation?: boolean
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
  nbLoadedHits,
  nbHits,
  isFetchingNextPage,
  venueName,
  isSharingLocation,
}: VenueSelectionModalProps) {
  const [selectedOffer, setSelectedOffer] = useState<number>()
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const venueListRef = useRef<FlatList<VenueListItem>>(null)
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
      <ModalHeaderContainer>
        <View style={{ height: HEIGHT_CONTAINER + top }} />
        <ModalHeader
          title={title}
          rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
          rightIcon={Close}
          onRightIconPress={onClosePress}
        />
        <Spacer.Column numberOfSpaces={6} />
      </ModalHeaderContainer>
    )
  }, [onClosePress, title, top])

  const handlePressFooter = () => {
    const currentRef = venueListRef.current
    if (currentRef instanceof FlatList) {
      const button = (currentRef.getNativeScrollRef() as unknown as HTMLElement).children[0]
        .lastChild as HTMLElement
      const offerLink = button?.previousSibling?.firstChild?.firstChild as HTMLElement
      offerLink.focus()
      offerLink.blur()
      if (onEndReached) {
        onEndReached()
      }
    }
  }

  const headerMessage = useMemo(
    () =>
      isSharingLocation ? 'Lieux disponibles autour de moi' : `Lieux à proximité de “${venueName}”`,
    [isSharingLocation, venueName]
  )

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
      <ListHeaderContainer>
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <Typo.Title3 {...getHeadingAttrs(2)}>Sélectionner un lieu</Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        {!isSharingLocation && (
          <React.Fragment>
            <GeolocationBanner
              title="Active ta géolocalisation"
              subtitle="Pour trouver les lieux autour de toi"
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        )}
        <HeaderMessageText>{headerMessage}</HeaderMessageText>
        <Spacer.Column numberOfSpaces={2} />
      </ListHeaderContainer>
      <View>
        <AutoScrollSwitch
          title="Activer le chargement automatique des résultats"
          active={autoScrollEnabled}
          toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
        />
      </View>
      <VenueSelectionList
        onItemSelect={setSelectedOffer}
        items={items}
        selectedItem={selectedOffer}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={onScroll}
        onPress={handlePressFooter}
        ref={venueListRef}
        autoScrollEnabled={autoScrollEnabled}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage={isFetchingNextPage}
        isSharingLocation={isSharingLocation}
      />
    </AppModal>
  )
}

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: getSpacing(4),
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))

const ModalHeaderContainer = styled.View({
  width: '100%',
  paddingHorizontal: getSpacing(6),
})

const ListHeaderContainer = styled.View({
  width: '100%',
  paddingHorizontal: getSpacing(7),
})

const HeaderMessageText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
