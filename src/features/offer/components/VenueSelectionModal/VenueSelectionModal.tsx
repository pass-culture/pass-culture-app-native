import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'
import styled from 'styled-components/native'

import {
  VenueListItem,
  VenueSelectionList,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, getSpacing } from 'ui/theme'
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
