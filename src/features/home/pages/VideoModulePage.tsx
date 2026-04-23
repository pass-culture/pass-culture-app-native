import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { FlatList, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoPlayer } from 'features/home/components/modules/video/VideoPlayer'
import { YoutubePlayerRef } from 'features/home/components/modules/video/YoutubePlayer/types'
import { VideoModulePageMetaHeader } from 'features/home/components/VideoModulePageMetaHeader'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Page } from 'ui/pages/Page'
import { Typo } from 'ui/theme'

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
    videoTag,
    videoPublicationDate,
    videoDescription,
    offerTitle,
    color,
    videoTitle,
  } = params
  const { goBack } = useGoBack(...homeNavigationConfig)
  const theme = useTheme()

  const { headerTransition, onScroll } = useOpacityTransition()

  const playerRef = useRef<YoutubePlayerRef>(null)

  const { offers } = useVideoOffersQuery(offersModuleParameters, moduleId, offerIds, eanList)

  const analyticsParams: OfferAnalyticsParams = {
    moduleId,
    moduleName,
    from: 'videoModal',
    homeEntryId: homeEntryId,
  }

  const renderHeader = () => (
    <React.Fragment>
      <StyledTagContainer>
        <Tag label={videoTag} variant={TagVariant.DEFAULT} />
      </StyledTagContainer>
      <TitleContainer>
        <Typo.Title3>{moduleName}</Typo.Title3>
      </TitleContainer>
      <StyledCaptionDate>{`Publiée le ${formatToFrenchDate(
        new Date(videoPublicationDate)
      )}`}</StyledCaptionDate>

      {videoDescription ? (
        <VideoDescriptionContainer>
          <StyledBody>{videoDescription}</StyledBody>
        </VideoDescriptionContainer>
      ) : null}

      <OfferTitleContainer>
        <Typo.Title4>{offerTitle}</Typo.Title4>
      </OfferTitleContainer>

      {!isMultiOffer && offers[0] ? (
        <VideoMonoOfferTileContainer>
          <VideoMonoOfferTile offer={offers[0]} color={color} analyticsParams={analyticsParams} />
        </VideoMonoOfferTileContainer>
      ) : null}
    </React.Fragment>
  )

  return (
    <Page>
      <VideoModulePageMetaHeader title={moduleName} />
      {/* On web header is called before Body for accessibility navigate order */}
      {isWeb ? (
        <ContentHeader
          headerTitle={videoTitle}
          onBackPress={goBack}
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
      />

      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={isMultiOffer ? offers : []}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.objectID.toString()}
        renderItem={({ item }) => (
          <HorizontalOfferTile key={item.objectID} offer={item} analyticsParams={analyticsParams} />
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
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      )}
    </Page>
  )
}

const StyledTagContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  alignItems: 'flex-start',
}))

const StyledCaptionDate = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const TitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.s,
}))

const VideoDescriptionContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const OfferTitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const VideoMonoOfferTileContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

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
