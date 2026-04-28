import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { FlatList, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VideoModuleHeader } from 'features/home/components/modules/video/VideoModuleHeader'
import { VideoPlayer } from 'features/home/components/modules/video/VideoPlayer'
import { YoutubePlayerRef } from 'features/home/components/modules/video/YoutubePlayer/types'
import { VideoModulePageMetaHeader } from 'features/home/components/VideoModulePageMetaHeader'
import { TranscriptionModal } from 'features/home/pages/TranscriptionModal'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentTypes } from 'libs/contentful/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Button } from 'ui/designSystem/Button/Button'
import { Page } from 'ui/pages/Page'
import { PressFilled } from 'ui/svg/icons/venueAndCategories/PressFilled'

const isWeb = Platform.OS === 'web'

export const VideoModulePage: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'VideoModulePage'>>()
  const {
    moduleId,
    moduleName,
    homeEntryId,
    offersModuleParameters,
    offerIds,
    eanList,
    youtubeVideoId,
    isMultiOffer,
    videoTitle,
    transcription,
  } = params
  const { goBack } = useGoBack(...homeNavigationConfig)
  const theme = useTheme()

  const { headerTransition, onScroll } = useOpacityTransition()

  const { visible, showModal, hideModal } = useModal(false)

  const playerRef = useRef<YoutubePlayerRef>(null)

  const { offers } = useVideoOffersQuery(offersModuleParameters, moduleId, offerIds, eanList)

  const analyticsParams: OfferAnalyticsParams = {
    moduleId,
    moduleName,
    from: 'videoModal',
    homeEntryId: homeEntryId,
  }

  const handleLogHasDismissedModal = async () => {
    const playerCurrentRef = playerRef.current
    if (playerCurrentRef) {
      const [videoDuration, elapsed] = await Promise.all([
        playerCurrentRef.getDuration(),
        playerCurrentRef.getCurrentTime(),
      ])

      void analytics.logHasDismissedModal({
        moduleId,
        modalType: ContentTypes.VIDEO,
        videoDuration: Math.round(videoDuration),
        seenDuration: Math.round(elapsed),
      })
    }
  }

  const onGoBackPress = async () => {
    await handleLogHasDismissedModal()
    goBack()
  }

  return (
    <React.Fragment>
      <Page>
        <VideoModulePageMetaHeader title={moduleName} />
        {/* On web header is called before Body for accessibility navigate order */}
        {isWeb ? (
          <ContentHeader
            headerTitle={videoTitle}
            onBackPress={onGoBackPress}
            headerTransition={headerTransition}
          />
        ) : null}

        <VideoPlayer
          youtubeVideoId={youtubeVideoId}
          offer={isMultiOffer ? undefined : offers[0]}
          moduleId={moduleId}
          moduleName={moduleName}
          homeEntryId={homeEntryId}
          playerRef={playerRef}
          onPressSeeOffer={handleLogHasDismissedModal}
        />

        <TranscriptionButtonContainer>
          <Button
            variant="tertiary"
            size="small"
            wording="Voir la transcription"
            color="neutral"
            fullWidth={false}
            icon={PressFilled}
            onPress={showModal}
          />
        </TranscriptionButtonContainer>

        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={isMultiOffer ? offers : []}
          ListHeaderComponent={
            <VideoModuleHeader
              analyticsParams={analyticsParams}
              handleLogHasDismissedModal={handleLogHasDismissedModal}
              offers={offers}
            />
          }
          keyExtractor={(item) => item.objectID.toString()}
          renderItem={({ item }) => (
            <HorizontalOfferTile
              key={item.objectID}
              offer={item}
              analyticsParams={analyticsParams}
              onPress={handleLogHasDismissedModal}
            />
          )}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
          contentContainerStyle={{
            paddingBottom: theme.tabBar.height + theme.designSystem.size.spacing.l,
            paddingHorizontal: theme.designSystem.size.spacing.xl,
          }}
        />

        {/* On native header is called after Body to implement the BlurView for iOS */}
        {isWeb ? null : (
          <ContentHeader
            headerTitle={videoTitle}
            onBackPress={onGoBackPress}
            headerTransition={headerTransition}
          />
        )}
      </Page>
      <TranscriptionModal
        closeModal={hideModal}
        isVisible={visible}
        title={videoTitle}
        transcription={transcription}
      />
    </React.Fragment>
  )
}

const ItemSeparatorContainer = styled.View(({ theme }) => ({
  height: 2,
  marginVertical: theme.designSystem.size.spacing.l,
}))

function ItemSeparatorComponent() {
  return (
    <ItemSeparatorContainer>
      <Separator.Horizontal />
    </ItemSeparatorContainer>
  )
}

const TranscriptionButtonContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
  marginLeft: theme.designSystem.size.spacing.xl,
  alignItems: 'flex-start',
}))
