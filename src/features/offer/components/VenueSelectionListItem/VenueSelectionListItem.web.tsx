import React, { CSSProperties } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SelectableListItem } from 'features/offer/components/SelectableListItem/SelectableListItem'
import { VenueDetails } from 'features/offer/components/VenueDetails/VenueDetails'
import {
  VenueListItem,
  VenueSelectionListProps,
} from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { getSpacing } from 'ui/theme'

export type RowData = {
  items: VenueListItem[]
  nbHits: VenueSelectionListProps['nbHits']
  isFetchingNextPage: VenueSelectionListProps['isFetchingNextPage']
  autoScrollEnabled: VenueSelectionListProps['autoScrollEnabled']
  onPress: VenueSelectionListProps['onPress']
  isSharingLocation: boolean
  subTitle: string
  headerMessage: string
  selectedItem?: number
  onItemSelect: (itemOfferId: number) => void
}

interface RowProps {
  index: number
  style: CSSProperties
  data: RowData
}

export function VenueSelectionListItem({ index, style, data }: Readonly<RowProps>) {
  const isHeader = index === 0
  const isFooter = index === data.items.length - 1
  const hasHits = data.nbHits > 0
  const shouldDisplayHeader = isHeader && hasHits

  if (shouldDisplayHeader) {
    return (
      <li style={style}>
        <Wrapper>
          <VenueSelectionListHeader
            subTitle={data.subTitle}
            isSharingLocation={data.isSharingLocation}
            headerMessage={data.headerMessage}
          />
        </Wrapper>
      </li>
    )
  }

  if (isFooter) {
    return (
      <Wrapper>
        <SearchListFooter
          isFetchingNextPage={data.isFetchingNextPage}
          nbLoadedHits={data.items.length}
          nbHits={data.nbHits}
          autoScrollEnabled={data.autoScrollEnabled}
          onPress={data.onPress}
          style={style}
        />
      </Wrapper>
    )
  }

  return (
    <li style={style}>
      <Wrapper>
        <ItemWrapper>
          <SelectableListItem
            // @ts-expect-error: because of noUncheckedIndexedAccess
            onSelect={() => data.onItemSelect(data.items[index].offerId)}
            isSelected={data.selectedItem === data.items[index]?.offerId}
            testID="venue-selection-list-item"
            render={({ isHover }) => (
              <VenueDetails
                // @ts-expect-error: because of noUncheckedIndexedAccess
                title={data.items[index].title}
                // @ts-expect-error: because of noUncheckedIndexedAccess
                address={data.items[index].address}
                // @ts-expect-error: because of noUncheckedIndexedAccess
                distance={data.isSharingLocation ? data.items[index].distance : ''}
                isHover={isHover}
              />
            )}
          />
        </ItemWrapper>
      </Wrapper>
    </li>
  )
}

const ItemWrapper = styled(View)({
  paddingTop: getSpacing(2),
})

const Wrapper = styled(View)(({ theme }) => ({
  paddingLeft: theme.modal.spacing.MD,
  paddingRight: theme.modal.spacing.MD,
}))
