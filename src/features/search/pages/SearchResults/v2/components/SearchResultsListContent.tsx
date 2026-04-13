import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { SearchResultItem } from 'features/search/types'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { LENGTH_XXS, RATIO_HOME_IMAGE } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

type Props = {
  item: SearchResultItem
  index: number
  onArtistPlaylistItemPress: (id: string, name: string) => void
  isGridLayout: boolean
  searchId: string | undefined
  query: string
}

export const SearchResultsListContent: FC<Props> = ({
  item,
  index,
  onArtistPlaylistItemPress,
  isGridLayout,
  searchId,
  query,
}) => {
  const { width } = useWindowDimensions()
  const { designSystem, breakpoints } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { tileWidth, nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  if (item.type === 'artist') {
    return (
      <AvatarListItem
        id={item.data.id}
        image={item.data.image}
        name={item.data.name}
        onItemPress={onArtistPlaylistItemPress}
        size={AVATAR_MEDIUM}
        isFullWidth
      />
    )
  }

  if (item.type === 'venue')
    return (
      <SearchVenueItemContainer index={index} gutter={10}>
        <SearchVenueItem venue={item.data} height={LENGTH_XXS} width={tileWidth} index={index} />
      </SearchVenueItemContainer>
    )

  return (
    <React.Fragment>
      {isGridLayout ? (
        <OfferTileWrapper
          item={item.data}
          analyticsFrom="searchresults"
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          containerWidth={width / nbrOfTilesToDisplay}
          searchId={searchId}
        />
      ) : (
        <HorizontalOfferTile
          offer={item.data}
          analyticsParams={{
            query,
            index,
            searchId,
            from: 'searchresults',
          }}
        />
      )}
    </React.Fragment>
  )
}

const SearchVenueItemContainer = styled.View<{ index: number; gutter: number }>(
  ({ theme, index, gutter }) => ({
    ...(theme.isMobileViewport
      ? {
          paddingLeft: index % 2 === 0 ? 0 : gutter,
          marginBottom: gutter,
        }
      : {
          paddingVertical: theme.designSystem.size.spacing.l,
          gap: theme.designSystem.size.spacing.l,
          display: 'grid',
          gridTemplateColumns: `repeat(5, 1fr)`,
        }),
  })
)
