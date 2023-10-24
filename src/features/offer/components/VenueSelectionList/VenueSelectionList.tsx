import React, { forwardRef, useCallback, useMemo } from 'react'
import { FlatList, FlatListProps, View, ViewProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { VenueSelectionListItem } from 'features/offer/components/VenueSelectionListItem/VenueSelectionListItem'
import { VenueDetail } from 'features/offer/types'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole.web'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type VenueListItem = VenueDetail & {
  offerId: number
}

export type VenueSelectionListProps = ViewProps &
  Pick<FlatListProps<VenueListItem>, 'onRefresh' | 'refreshing' | 'onEndReached' | 'onScroll'> & {
    selectedItem?: number
    onItemSelect: (itemOfferId: number) => void
    items: VenueListItem[]
    nbLoadedHits: number
    nbHits: number
    autoScrollEnabled: boolean
    isFetchingNextPage: boolean
    onPress?: () => void
    isSharingLocation?: boolean
    venueName?: string
    onPressGeolocPermissionModalButton?: VoidFunction
  }

const keyExtractor = (item: VenueListItem) => String(item.offerId)

export const VenueSelectionList = forwardRef<FlatList<VenueListItem>, VenueSelectionListProps>(
  (
    {
      items,
      nbLoadedHits,
      nbHits,
      selectedItem,
      onItemSelect,
      onEndReached,
      refreshing,
      onRefresh,
      isFetchingNextPage,
      onScroll,
      onPress,
      autoScrollEnabled,
      isSharingLocation,
      venueName,
      onPressGeolocPermissionModalButton,
      ...props
    },
    ref
  ) => {
    const { modal } = useTheme()

    const renderItem = useCallback(
      ({ item }: { item: VenueListItem }) => {
        return (
          <ItemWrapper key={item.offerId}>
            <VenueSelectionListItem
              {...item}
              distance={isSharingLocation ? item.distance : ''}
              onSelect={() => onItemSelect(item.offerId)}
              isSelected={selectedItem === item.offerId}
            />
          </ItemWrapper>
        )
      },
      [onItemSelect, selectedItem, isSharingLocation]
    )

    const headerMessage = useMemo(
      () =>
        isSharingLocation
          ? 'Lieux disponibles autour de moi'
          : `Lieux à proximité de “${venueName}”`,
      [isSharingLocation, venueName]
    )

    const listHeader = useMemo(
      () => (
        <React.Fragment>
          <ListHeaderContainer>
            <Spacer.Column numberOfSpaces={6} />
            <Typo.Title3 {...getHeadingAttrs(2)}>Sélectionner un lieu</Typo.Title3>
            <Spacer.Column numberOfSpaces={6} />
            {!isSharingLocation && (
              <React.Fragment>
                <GeolocationBanner
                  title="Active ta géolocalisation"
                  subtitle="Pour trouver les lieux autour de toi"
                  onPress={onPressGeolocPermissionModalButton}
                />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
            <HeaderMessageText>{headerMessage}</HeaderMessageText>
            <Spacer.Column numberOfSpaces={2} />
          </ListHeaderContainer>
        </React.Fragment>
      ),
      [headerMessage, isSharingLocation, onPressGeolocPermissionModalButton]
    )

    return (
      <FlatList
        accessibilityRole={AccessibilityRole.LIST}
        listAs="ul"
        itemAs="li"
        ref={ref}
        testID="offerVenuesList"
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={autoScrollEnabled ? onEndReached : undefined}
        scrollEnabled={items.length > 0}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: modal.spacing.MD }}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          <SearchListFooter
            isFetchingNextPage={isFetchingNextPage}
            nbLoadedHits={nbLoadedHits}
            nbHits={nbHits}
            autoScrollEnabled={autoScrollEnabled}
            onPress={onPress}
          />
        }
        {...props}
      />
    )
  }
)
VenueSelectionList.displayName = 'VenueSelectionList'

/**
 * I really don't like to do these styles but since my items are
 * in a `FlatList`, if I don't apply some padding the negative
 * outline won't be visible :(
 *
 * So I have to add a padding so it's visible again.
 */
const ItemWrapper = styled(View)({
  paddingHorizontal: getSpacing(1),
  paddingTop: getSpacing(2),
})

const ListHeaderContainer = styled.View({
  width: '100%',
})

const HeaderMessageText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
