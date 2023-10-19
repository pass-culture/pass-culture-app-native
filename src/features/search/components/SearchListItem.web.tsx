import React, { CSSProperties } from 'react'
import styled from 'styled-components/native'

import { SearchListProps, SearchState } from 'features/search/types'
import { AlgoliaVenue } from 'libs/algolia'
import { Offer } from 'shared/offer/types'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing } from 'ui/theme'

export type RowData = {
  items: Offer[]
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
