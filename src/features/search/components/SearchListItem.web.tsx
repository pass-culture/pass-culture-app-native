import React, { CSSProperties } from 'react'
import styled from 'styled-components/native'

import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { SearchListProps, SearchState } from 'features/search/types'
import { AlgoliaVenue } from 'libs/algolia'
import { Offer } from 'shared/offer/types'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing } from 'ui/theme'

export type RowData = {
  items: (Record<string, never> | Offer)[]
  userData: SearchListProps['userData']
  venuesUserData: SearchListProps['venuesUserData']
  nbHits: SearchListProps['nbHits']
  offers: Offer[]
  venues: AlgoliaVenue[]
  isFetchingNextPage: SearchListProps['isFetchingNextPage']
  autoScrollEnabled: SearchListProps['autoScrollEnabled']
  onPress: SearchListProps['onPress']
  searchState: SearchState
}

interface RowProps {
  index: number
  style: CSSProperties
  data: RowData
}

export function SearchListItem({ index, style, data }: Readonly<RowProps>) {
  const isHeader = index === 0
  const isFooter = index === data.items.length - 1
  const hasHits = data.nbHits > 0
  const shouldDisplayHeader = isHeader && hasHits

  if (shouldDisplayHeader) {
    return (
      <div style={style}>
        <SearchListHeader
          nbHits={data.nbHits}
          userData={data.userData}
          venuesUserData={data.venuesUserData}
          venues={data.venues}
        />
      </div>
    )
  }

  if (isFooter) {
    return (
      <SearchListFooter
        isFetchingNextPage={data.isFetchingNextPage}
        nbLoadedHits={data.offers?.length}
        nbHits={data.nbHits}
        autoScrollEnabled={data.autoScrollEnabled}
        onPress={data.onPress}
        style={style}
      />
    )
  }

  return (
    <li style={style}>
      <StyledHorizontalOfferTile
        offer={data.items[index] as Offer}
        analyticsParams={{
          query: data.searchState.query,
          index,
          searchId: data.searchState.searchId,
          from: 'search',
        }}
      />
      <Separator />
    </li>
  )
}

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)({
  marginHorizontal: getSpacing(6),
})
