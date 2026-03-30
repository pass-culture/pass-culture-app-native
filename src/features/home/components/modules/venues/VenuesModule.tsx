import React, { useCallback, useEffect } from 'react'
import { ViewToken } from 'react-native'
import { useTheme } from 'styled-components'
import { styled } from 'styled-components/native'

import { VenueTile } from 'features/home/components/modules/venues/VenueTile'
import { ModuleData } from 'features/home/types'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { LENGTH_S } from 'ui/theme'

type VenuesModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  homeEntryId: string | undefined
  index: number
  data?: ModuleData
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
}

const ITEM_HEIGHT = LENGTH_S
const ITEM_WIDTH = ITEM_HEIGHT * (3 / 2)

const keyExtractor = (item: VenueHit) => item.id.toString()

export const VenuesModule = ({
  moduleId,
  displayParameters,
  index,
  homeEntryId,
  data,
  onViewableItemsChanged,
}: VenuesModuleProps) => {
  const enableVolunteerNewTag = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_VOLUNTEER_NEW_TAG)
  const enableVolunteerFeedback = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_VOLUNTEER_FEEDBACK
  )
  const moduleName = displayParameters.title
  const { playlistItems = [] } = data ?? { playlistItems: [] }
  const { designSystem } = useTheme()
  const renderItem: CustomListRenderItem<VenueHit> = useCallback(
    ({ item, width, height }) => (
      <VenueTile
        moduleName={moduleName}
        moduleId={moduleId}
        homeEntryId={homeEntryId}
        venue={item}
        width={width}
        height={height}
      />
    ),
    [moduleName, moduleId, homeEntryId]
  )

  const shouldModuleBeDisplayed = playlistItems.length > displayParameters.minOffers
  const isExclusiveVolunteering = displayParameters.isExclusiveVolunteering ?? false
  const showNewTag = enableVolunteerNewTag && isExclusiveVolunteering
  const showFeedback = enableVolunteerFeedback && isExclusiveVolunteering

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.VENUES_PLAYLIST,
        index,
        homeEntryId,
        venues: (playlistItems as VenueHit[]).map((item) => String(item.id)),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  return (
    <Container gap={4}>
      <ObservedPlaylist onViewableItemsChanged={onViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <PassPlaylist
            title={displayParameters.title}
            subtitle={displayParameters.subtitle}
            data={playlistItems || []}
            itemHeight={ITEM_HEIGHT}
            itemWidth={ITEM_WIDTH}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            tileType="venue"
            withMargin
            contentContainerStyle={{ paddingHorizontal: designSystem.size.spacing.xl }}
            onViewableItemsChanged={handleViewableItemsChanged}
            playlistRef={listRef}
            showNewTag={showNewTag}
            noMarginBottom
          />
        )}
      </ObservedPlaylist>
      {showFeedback ? (
        <StyledFeedBack
          storageKey="volunteering_feedback"
          likeQuiz="https://passculture.qualtrics.com/jfe/form/SV_3sGi4gI6EEOmfsy"
          dislikeQuiz="https://passculture.qualtrics.com/jfe/form/SV_3sGi4gI6EEOmfsy"
          title="Le bénévolat sur le pass t’intéresse t-il&nbsp;?"
          // TODO(PC-40467): add tracking
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onLogReaction={() => {}}
        />
      ) : null}
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledFeedBack = styled(FeedBack)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  width: theme.isDesktopViewport ? '50%' : 'auto',
}))
