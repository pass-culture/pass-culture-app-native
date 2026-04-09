import React, { useRef } from 'react'
import YouTube from 'react-youtube'
import styled from 'styled-components/native'

import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferList } from 'features/home/components/modules/video/VideoMultiOfferList'
import { VideoPlayerWeb } from 'features/home/components/modules/video/VideoPlayerWeb.web'
import { VideoModule } from 'features/home/types'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentTypes } from 'libs/contentful/types'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { AppModal } from 'ui/components/modals/AppModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'

interface VideoModalProps extends VideoModule {
  offers: Offer[]
  visible: boolean
  hideModal: () => void
  moduleId: string
  homeEntryId: string
  isMultiOffer: boolean
}

export const VideoModal: React.FC<VideoModalProps> = (props) => {
  const playerRef = useRef<YouTube>(null)

  const analyticsParams: OfferAnalyticsParams = {
    moduleId: props.id,
    moduleName: props.title,
    from: 'videoModal',
    homeEntryId: props.homeEntryId,
  }

  const onCloseModal = async () => {
    const playerCurrentRef = playerRef?.current?.internalPlayer
    if (playerCurrentRef) {
      const [videoDuration, elapsed] = await Promise.all([
        playerCurrentRef.getDuration(),
        playerCurrentRef.getCurrentTime(),
      ])

      analytics.logHasDismissedModal({
        moduleId: props.moduleId,
        modalType: ContentTypes.VIDEO,
        videoDuration: Math.round(videoDuration),
        seenDuration: Math.round(elapsed),
      })
    }

    props.hideModal()
  }

  return (
    <AppModal
      title={`Modal ${props.title}`}
      visible={props.visible}
      isUpToStatusBar
      noPadding
      noPaddingBottom
      scrollEnabled={false}
      customModalHeader={<React.Fragment />}
      onBackdropPress={onCloseModal}>
      <VideoPlayerWeb
        youtubeVideoId={props.youtubeVideoId}
        offer={props.isMultiOffer ? undefined : props.offers[0]}
        onPressSeeOffer={props.hideModal}
        moduleId={props.moduleId}
        moduleName={props.title}
        homeEntryId={props.homeEntryId}
        playerRef={playerRef}
      />

      <StyledScrollView>
        <StyledTagContainer>
          <Tag label={props.videoTag} variant={TagVariant.DEFAULT} />
        </StyledTagContainer>
        <Typo.Title3>{props.title}</Typo.Title3>
        <StyledCaptionDate>{`Publiée le ${formatToFrenchDate(
          new Date(props.videoPublicationDate)
        )}`}</StyledCaptionDate>
        {props.videoDescription ? <StyledBody>{props.videoDescription}</StyledBody> : null}
        <StyledTitle>{props.offerTitle}</StyledTitle>
        {props.isMultiOffer ? (
          <VideoMultiOfferList
            offers={props.offers}
            hideModal={props.hideModal}
            analyticsParams={analyticsParams}
          />
        ) : null}
        {!props.isMultiOffer && props.offers[0] ? (
          <StyledVideoMonoOfferTile
            offer={props.offers[0]}
            color={props.color}
            hideModal={props.hideModal}
            analyticsParams={analyticsParams}
          />
        ) : null}
      </StyledScrollView>
      <CloseButtonWrapper>
        <Button
          iconButton
          icon={Close}
          accessibilityLabel="Fermer la modale vidéo"
          onPress={onCloseModal}
          variant="secondary"
          color="neutral"
        />
      </CloseButtonWrapper>
    </AppModal>
  )
}
const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const CloseButtonWrapper = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.l,
  right: theme.designSystem.size.spacing.l,
}))

const StyledTagContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.s,
}))

const StyledCaptionDate = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  marginTop: theme.designSystem.size.spacing.s,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginTop: theme.designSystem.size.spacing.s,
}))
const StyledTitle = styled(Typo.Title4)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))
