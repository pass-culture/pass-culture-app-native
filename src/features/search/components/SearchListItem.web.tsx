import React, { CSSProperties, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SearchListFooter } from 'features/search/components/SearchListFooter/SearchListFooter.web'
import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { SearchListProps, SearchState } from 'features/search/types'
import { Artist } from 'features/venue/types'
import { AlgoliaVenue } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { LineSeparator } from 'ui/components/LineSeparator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing } from 'ui/theme'

export const headerPlaceholder = {} as const
export const footerPlaceholder = {} as const

export type RowData = {
  items: (typeof headerPlaceholder | Offer | typeof footerPlaceholder)[]
  userData: SearchListProps['userData']
  venuesUserData: SearchListProps['venuesUserData']
  nbHits: SearchListProps['nbHits']
  artists?: Artist[]
  offers: Offer[]
  venues: AlgoliaVenue[]
  isFetchingNextPage: SearchListProps['isFetchingNextPage']
  autoScrollEnabled: SearchListProps['autoScrollEnabled']
  onPress: SearchListProps['onPress']
  searchState: SearchState
  artistSection?: ReactNode
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
      <li style={style}>
        <SearchListHeader
          nbHits={data.nbHits}
          artistSection={data.artistSection}
          userData={data.userData}
          venuesUserData={data.venuesUserData}
          venues={data.venues}
        />
      </li>
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
        style={style as StyleProp<ViewStyle>}
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
          from: 'searchresults',
        }}
      />
      <LineSeparator />
    </li>
  )
}

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)({
  marginHorizontal: getSpacing(6),
})
