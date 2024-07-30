import React, { useRef } from 'react'
import { View } from 'react-native'
import YouTube from 'react-youtube'
import styled from 'styled-components/native'

import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferList } from 'features/home/components/modules/video/VideoMultiOfferList'
import { VideoPlayerWeb } from 'features/home/components/modules/video/VideoPlayerWeb.web'
import { VideoModule } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentTypes } from 'libs/contentful/types'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
        <Spacer.Column numberOfSpaces={4} />
        <StyledTagContainer>
          <StyledTagBackground color={props.color}>
            <StyledCaptionTag>{props.videoTag}</StyledCaptionTag>
          </StyledTagBackground>
        </StyledTagContainer>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Title3>{props.title}</Typo.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <StyledCaptionDate>{`Publiée le ${formatToFrenchDate(
          props.videoPublicationDate
        )}`}</StyledCaptionDate>
        {props.videoDescription ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <StyledBody>{props.videoDescription}</StyledBody>
          </React.Fragment>
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
        <Typo.Title4>{props.offerTitle}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        {props.isMultiOffer ? (
          <VideoMultiOfferList
            offers={props.offers}
            hideModal={props.hideModal}
            analyticsParams={analyticsParams}
          />
        ) : null}
        {!props.isMultiOffer && props.offers[0] ? (
          <React.Fragment>
            <VideoMonoOfferTile
              offer={props.offers[0]}
              color={props.color}
              hideModal={props.hideModal}
              analyticsParams={analyticsParams}
              homeEntryId={props.homeEntryId}
            />
            <Spacer.Column numberOfSpaces={8} />
          </React.Fragment>
        ) : null}
      </StyledScrollView>
      <StyledTouchable onPress={onCloseModal} accessibilityLabel="Fermer la modale vidéo">
        <StyledCloseIcon />
      </StyledTouchable>
    </AppModal>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  position: 'absolute',
  top: getSpacing(4),
  right: getSpacing(4),
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.colors.white,
}))

const StyledTagContainer = styled.View({
  alignItems: 'flex-start',
})

const StyledTagBackground = styled(View)<{ color: string }>(({ color }) => ({
  backgroundColor: getTagColor(color),
  padding: getSpacing(1),
  borderRadius: theme.borderRadius.checkbox,
}))

const StyledCaptionTag = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledCaptionDate = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledScrollView = styled.ScrollView({
  paddingHorizontal: getSpacing(6),
})

const StyledCloseIcon = styled(Close).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
