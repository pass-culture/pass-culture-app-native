import { useNavigation } from '@react-navigation/native'
import React, { Ref, useEffect } from 'react'
import { Platform, StyleProp, ViewStyle, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { SearchStackParamList } from 'features/navigation/navigators/SearchStackNavigator/types'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getActivitiesFromSearchGroup } from 'features/search/helpers/getActivitiesFromSearchGroup/getActivitiesFromSearchGroup'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { AlgoliaVenue, AlgoliaVenueOfferListItem } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { Playlist } from 'ui/components/Playlist'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Map } from 'ui/svg/icons/Map'
import { LENGTH_XS, LENGTH_XXS, Typo } from 'ui/theme'

export const VENUE_ITEM_HEIGHT = LENGTH_XXS
export const VENUE_ITEM_WIDTH = LENGTH_XS
const keyExtractor = (item: AlgoliaVenue) => item.objectID

type Props = {
  venuePlaylistTitle: string
  venues: AlgoliaVenueOfferListItem[]
  isLocated?: boolean
  shouldDisplaySeparator?: boolean
  currentView?: keyof SearchStackParamList
  offerCategory?: SearchGroupNameEnumv2
  searchGroup?: SearchGroupNameEnumv2
  style?: StyleProp<ViewStyle>
  playlistRef?: Ref<FlatList>
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken<unknown>[]
    changed: ViewToken<unknown>[]
  }) => void
  withMargins?: boolean
}

const renderVenueItem = (
  {
    item,
    height,
    width,
    index,
  }: {
    item: AlgoliaVenue
    height: number
    width: number
    index: number
  },
  searchId?: string,
  searchGroupLabel?: ContentfulLabelCategories
) => (
  <SearchVenueItem
    venue={item}
    height={height}
    width={width}
    index={index}
    searchId={searchId}
    searchGroupLabel={searchGroupLabel}
  />
)

const isWeb = Platform.OS === 'web'

export const VenuePlaylist: React.FC<Props> = ({
  venuePlaylistTitle,
  venues = [],
  isLocated = false,
  currentView = 'SearchResults',
  offerCategory,
  shouldDisplaySeparator = true,
  searchGroup,
  style,
  playlistRef,
  onViewableItemsChanged,
  withMargins = true,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    searchState: { searchId },
  } = useSearch()
  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const { setVenuesFilters } = venuesFilterActions
  const { designSystem } = useTheme()
  const logVenuePlaylistDisplayedOnSearchResultsOnce = useFunctionOnce(() =>
    analytics.logVenuePlaylistDisplayedOnSearchResults({
      searchId,
      isLocated,
      searchNbResults: venues?.length,
    })
  )

  useEffect(() => {
    if (currentView === 'SearchResults') logVenuePlaylistDisplayedOnSearchResultsOnce()
  }, [currentView, logVenuePlaylistDisplayedOnSearchResultsOnce])

  const logAllTilesSeenOnce = useFunctionOnce(() => analytics.logAllTilesSeen({ searchId }))

  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const searchGroupLabel = searchGroup
    ? (searchGroupLabelMapping[searchGroup] as ContentfulLabelCategories)
    : undefined

  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const handleSeeMapPress = () => {
    setVenuesFilters(offerCategory ? getActivitiesFromSearchGroup(offerCategory) : [])

    if (isMapWithoutPositionAndNotLocated) {
      navigate('VenueMapLocationModal', { openedFrom: 'searchPlaylist' })
      return
    }

    void analytics.logConsultVenueMap({ from: 'searchPlaylist' })
    navigate('VenueMap')
  }

  const shouldDisplaySeeOnMapButton = enabledVenueMap && currentView === 'ThematicSearch' && !isWeb

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'venues',
      moduleName: venuePlaylistTitle,
      from: 'search',
    })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistVenues' as const,
    params: {
      module: {
        type: VerticalPlaylist.ThematicSearchVenues,
        data: venues,
        displayParameters: { title: venuePlaylistTitle, subtitle: undefined },
      },
    },
  }

  return (
    <React.Fragment>
      <Container style={style}>
        <HeaderPlaylistContainer withMargins={withMargins}>
          <SeeAllButtonContainer gap={3} withMargins={withMargins}>
            <TitleContainer>
              <Typo.Title3 numberOfLines={isWeb ? 1 : undefined}>{venuePlaylistTitle}</Typo.Title3>
            </TitleContainer>
            {venues.length > 1 ? (
              <SeeAllButton
                playlistTitle={venuePlaylistTitle}
                data={{
                  onBeforeNavigate,
                  navigateToVerticalPlaylist,
                  hideSearchSeeAll: true,
                }}
              />
            ) : null}
          </SeeAllButtonContainer>
          {shouldDisplaySeeOnMapButton ? (
            <ButtonContainer>
              <Button
                variant="tertiary"
                color="neutral"
                icon={Map}
                wording="Voir sur la carte"
                onPress={handleSeeMapPress}
              />
            </ButtonContainer>
          ) : null}
          <NumberOfItems nbItems={venues?.length ?? 0} />
        </HeaderPlaylistContainer>
        <Playlist
          data={venues}
          scrollButtonOffsetY={VENUE_ITEM_HEIGHT / 2 + 4}
          itemHeight={VENUE_ITEM_HEIGHT}
          itemWidth={VENUE_ITEM_WIDTH}
          renderItem={({ item, height, width, index }) =>
            renderVenueItem({ item, height, width, index }, searchId, searchGroupLabel)
          }
          renderHeader={undefined}
          renderFooter={undefined}
          keyExtractor={keyExtractor}
          testID="search-venue-list"
          onEndReached={logAllTilesSeenOnce}
          contentContainerStyle={withMargins && { paddingHorizontal: designSystem.size.spacing.xl }}
          ref={playlistRef}
          onViewableItemsChanged={onViewableItemsChanged}
          withMargins={false}
        />
      </Container>
      {shouldDisplaySeparator ? <StyledSeparator testID="venue-playlist-separator" /> : null}
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const HeaderPlaylistContainer = styled.View<{ withMargins: boolean }>(({ theme, withMargins }) => ({
  marginLeft: withMargins ? theme.designSystem.size.spacing.xl : 0,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  width: 'auto',
  marginLeft: theme.designSystem.size.spacing.xl,
  marginRight: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.m,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  alignSelf: 'flex-start',
  marginTop: theme.designSystem.size.spacing.xs,
}))

const TitleContainer = styled.View({
  flex: 1,
})

const SeeAllButtonContainer = styled(ViewGap)<{ withMargins: boolean }>(
  ({ theme, withMargins }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: withMargins ? theme.designSystem.size.spacing.xl : 0,
  })
)
