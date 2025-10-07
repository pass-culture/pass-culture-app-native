import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, useWindowDimensions, View } from 'react-native'
import { ListOnScrollProps, VariableSizeList } from 'react-window'
import styled from 'styled-components/native'

import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import {
  footerPlaceholder,
  headerPlaceholder,
  RowData,
  SearchListItem,
} from 'features/search/components/SearchListItem.web'
import { LIST_ITEM_HEIGHT } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  convertAlgoliaVenue2AlgoliaVenueOfferListItem,
  getReconciledVenues,
} from 'features/search/helpers/searchList/getReconciledVenues'
import { useScrollToBottomOpacity } from 'features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity'
import { SearchListProps, SearchView } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ScrollToTop } from 'ui/svg/icons/ScrollToTop'
import { getSpacing } from 'ui/theme'

const BASE_HEADER_HEIGHT = 112
const USER_DATA_MESSAGE_HEIGHT = 72
const GEOLOCATION_BUTTON_HEIGHT_ONE_LINE = 106
const GEOLOCATION_BUTTON_HEIGHT_TWO_LINE = 130
const VENUES_PLAYLIST_HEIGHT = 297
const BREAKING_POINT_GEOLOCATION_MODAL_HEIGHT = 465
const ARTISTS_PLAYLIST_HEIGHT = 300

const FOOTER_SIZE = 104
const LOAD_MORE_THRESHOLD = 300

type CustomUserData = Record<'message', string>[] | undefined

type GetHeaderSizeType = {
  userData: CustomUserData
  isGeolocated: boolean
  hasVenuesPlaylist: boolean
  hasArtistsPlaylist: boolean
  windowWidth: number
}

export const getHeaderSize = ({
  userData,
  isGeolocated,
  hasVenuesPlaylist,
  hasArtistsPlaylist,
  windowWidth,
}: GetHeaderSizeType) => {
  let totalHeight = BASE_HEADER_HEIGHT

  if (userData?.[0]?.message) {
    totalHeight += USER_DATA_MESSAGE_HEIGHT
  } else if (!isGeolocated) {
    totalHeight +=
      windowWidth >= BREAKING_POINT_GEOLOCATION_MODAL_HEIGHT
        ? GEOLOCATION_BUTTON_HEIGHT_ONE_LINE
        : GEOLOCATION_BUTTON_HEIGHT_TWO_LINE
  }

  if (hasVenuesPlaylist) {
    totalHeight += VENUES_PLAYLIST_HEIGHT
  }
  if (hasArtistsPlaylist) {
    totalHeight += ARTISTS_PLAYLIST_HEIGHT
  }

  return totalHeight
}

type GetItemSizeType = {
  index: number
  isGeolocated: boolean
  itemsCount: number
  userData: CustomUserData
  hasVenuesPlaylist: boolean
  hasArtistsPlaylist: boolean
  windowWidth: number
}

/**
 * Function called to compute row size.
 * Since the list contains header and footer components, it needs computation.
 */
const getItemSize = ({
  index,
  isGeolocated,
  itemsCount,
  userData,
  hasVenuesPlaylist,
  hasArtistsPlaylist,
  windowWidth,
}: GetItemSizeType) => {
  const isHeader = index === 0
  const isFooter = index === itemsCount - 1

  if (isHeader) {
    return getHeaderSize({
      userData,
      isGeolocated,
      hasVenuesPlaylist,
      hasArtistsPlaylist,
      windowWidth,
    })
  }

  if (isFooter) {
    return FOOTER_SIZE
  }

  return LIST_ITEM_HEIGHT
}

export const SearchList = forwardRef<never, SearchListProps>(
  (
    {
      nbHits,
      hits,
      autoScrollEnabled,
      isFetchingNextPage,
      onEndReached,
      onPress,
      userData,
      venuesUserData,
      artistSection,
    },
    _ref
  ) => {
    const [availableHeight, setAvailableHeight] = useState(0)
    const outerListRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<VariableSizeList<RowData>>(null)
    const { hasGeolocPosition } = useLocation()
    const { searchState } = useSearch()
    const previousRoute = usePreviousRoute()

    const isEnabledVenuesFromOfferIndex = useFeatureFlag(
      RemoteStoreFeatureFlags.ENABLE_VENUES_FROM_OFFER_INDEX
    )
    const venues = isEnabledVenuesFromOfferIndex
      ? getReconciledVenues(hits.offers, hits.venues)
      : hits.venues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)

    const hasVenuesPlaylist =
      !searchState.venue && !!venues && previousRoute?.name !== SearchView.Thematic

    /**
     * This method will compute maximum height to set list height programatically.
     */
    const onLayout = useCallback((event: LayoutChangeEvent) => {
      setAvailableHeight(event.nativeEvent.layout.height)
    }, [])

    const { opacity, handleScroll: handleScrollOpacity } = useScrollToBottomOpacity()

    const handleScroll = useCallback(
      (props: ListOnScrollProps) => {
        handleScrollOpacity(props)

        if (outerListRef.current && autoScrollEnabled) {
          const { scrollTop, scrollHeight, clientHeight } = outerListRef.current

          const isNearToBottom = scrollTop + clientHeight >= scrollHeight - LOAD_MORE_THRESHOLD

          if (isNearToBottom && !isFetchingNextPage) {
            onEndReached()
          }
        }
      },
      [autoScrollEnabled, handleScrollOpacity, isFetchingNextPage, onEndReached]
    )

    /**
     * Data given to every search list items.
     */
    const data = {
      /**
       * This one in special since we manually add two empty objects.
       * The first one is used as a placeholder to place Header component.
       * The last one is used as a placeholder to place Footer component.
       *
       * This is necessary since the Row component (`SearchListItem.web`) is generic and we need to
       * guess what we want to draw.
       */
      items: [headerPlaceholder, ...hits.offers, footerPlaceholder],
      userData,
      venuesUserData,
      nbHits,
      offers: hits.offers,
      venues,
      artistSection,
      isFetchingNextPage,
      autoScrollEnabled,
      onPress,
      searchState,
    }

    /**
     * The rerender key is used to rerender the `VariableSizeList` component when important changes happen.
     * Be careful to not add too many things here since it will completely rerender the list, and so scroll to the top.
     */
    const rerenderKey = useMemo(
      () => JSON.stringify({ isGeolocated: hasGeolocPosition, nbHits, autoScrollEnabled, onPress }),
      [hasGeolocPosition, nbHits, autoScrollEnabled, onPress]
    )

    const handleScrollToTopPress = useCallback(() => {
      listRef.current?.scrollToItem(0)
    }, [])

    const { width: windowWidth } = useWindowDimensions()

    const itemSizeFn = useCallback(
      (index: number) =>
        getItemSize({
          index,
          isGeolocated: hasGeolocPosition,
          itemsCount: data.items.length,
          userData,
          hasVenuesPlaylist,
          hasArtistsPlaylist: !!artistSection,
          windowWidth,
        }),
      [
        hasGeolocPosition,
        data.items.length,
        userData,
        hasVenuesPlaylist,
        artistSection,
        windowWidth,
      ]
    )

    return (
      <SearchResultList onLayout={onLayout} testID="searchResultsList">
        <React.Fragment>
          {/* @ts-expect-error - type incompatibility with React 19 */}
          <VariableSizeList
            ref={listRef}
            key={rerenderKey}
            innerElementType="ul"
            itemData={data}
            itemSize={itemSizeFn}
            height={availableHeight}
            itemCount={data.items.length}
            outerRef={outerListRef}
            onScroll={handleScroll}
            width="100%">
            {SearchListItem}
          </VariableSizeList>

          <ScrollToTopContainer style={{ opacity }}>
            <Container onPress={handleScrollToTopPress}>
              <StyledView>
                <ScrollToTopIcon />
              </StyledView>
            </Container>
          </ScrollToTopContainer>
        </React.Fragment>
      </SearchResultList>
    )
  }
)

SearchList.displayName = 'SearchListWeb'

const SearchResultList = styled(View)({
  flex: 1,
})

const ScrollToTopContainer = styled(Animated.View)(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
  overflow: 'hidden',
  border: 0,
}))

const Container = styledButton(Touchable)({ overflow: 'hidden' })

const StyledView = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: theme.designSystem.size.spacing.xxxl,
  width: theme.designSystem.size.spacing.xxxl,
}))

const ScrollToTopIcon = styled(ScrollToTop).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.lockedInverted,
  size: theme.icons.sizes.small,
}))``
