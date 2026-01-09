import React, { useMemo } from 'react'
import { FlatListProps, View, ViewProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueDetail } from 'features/offer/types'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

export type VenueListItem = VenueDetail & {
  offerId: number
}

export type VenueSelectionListProps = ViewProps &
  Pick<FlatListProps<VenueListItem>, 'onRefresh' | 'refreshing' | 'onScroll'> & {
    selectedItem?: number
    onItemSelect: (itemOfferId: number) => void
    items: VenueListItem[]
    nbLoadedHits: number
    nbHits: number
    autoScrollEnabled: boolean
    isFetchingNextPage: boolean
    onPress?: () => void
    isSharingLocation: boolean
    venueName?: string
    subTitle: string
    headerMessage: string
    onEndReached: () => void
    onPressGeolocationBanner?: VoidFunction
  }

export const VenueSelectionList = ({
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
  subTitle,
  headerMessage,
  onPressGeolocationBanner,
  ...props
}: VenueSelectionListProps) => {
  const { modal } = useTheme()

  const options: RadioButtonGroupOption[] = useMemo(
    () =>
      items.map((item) => ({
        key: item.offerId.toString(),
        label: item.title,
        description: item.address,
        asset:
          isSharingLocation && item.distance
            ? { variant: 'tag', tag: { label: `à ${item.distance}` } }
            : undefined,
      })),
    [items, isSharingLocation]
  )

  const handleValueChange = (label: string) => {
    const item = items.find((i) => i.title === label)
    if (item) {
      onItemSelect(item.offerId)
    }
  }

  const selectedLabel = useMemo(() => {
    if (selectedItem === undefined) return ''
    const item = items.find((i) => i.offerId === selectedItem)
    return item?.title ?? ''
  }, [selectedItem, items])

  return (
    <Container style={{ paddingHorizontal: modal.spacing.MD }} {...props}>
      {isSharingLocation ? null : (
        <React.Fragment>
          <GeolocationBanner
            title="Active ta géolocalisation"
            subtitle="Pour trouver les lieux autour de toi"
            analyticsFrom="offer"
            onPress={onPressGeolocationBanner}
          />
          <BannerSpacer />
        </React.Fragment>
      )}
      <RadioButtonGroup
        errorText="Une erreur est survenue"
        label={subTitle}
        description={headerMessage}
        options={options}
        variant="detailed"
        value={selectedLabel}
        onChange={handleValueChange}
        flatListProps={{
          onEndReached: autoScrollEnabled ? onEndReached : undefined,
          refreshing: refreshing ?? undefined,
          onRefresh: onRefresh ?? undefined,
          onScroll,
          ListFooterComponent: (
            <SearchListFooter
              isFetchingNextPage={isFetchingNextPage}
              nbLoadedHits={nbLoadedHits}
              nbHits={nbHits}
              autoScrollEnabled={autoScrollEnabled}
              onPress={onPress}
            />
          ),
        }}
      />
    </Container>
  )
}

VenueSelectionList.displayName = 'VenueSelectionList'

const Container = styled(View)({
  flex: 1,
})

const BannerSpacer = styled(View)(({ theme }) => ({
  height: theme.designSystem.size.spacing.xl,
}))
