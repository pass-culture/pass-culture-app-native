import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferList } from 'features/home/components/modules/video/VideoMultiOfferList'
import { VideoPlayer } from 'features/home/components/modules/video/VideoPlayer'
import { VideoModule } from 'features/home/types'
import { AnalyticsParams } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful'
import { formatToFrenchDate } from 'libs/parsers'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo, getSpacing } from 'ui/theme'

interface VideoModalProps extends VideoModule {
  offers: Offer[]
  visible: boolean
  hideModal: () => void
  moduleId: string
  homeEntryId: string
  isMultiOffer: boolean
}

export const VideoModal: React.FC<VideoModalProps> = (props) => {
  const StyledCloseIcon = styled(Close).attrs(({ theme }) => ({
    size: theme.icons.sizes.smaller,
  }))``

  const analyticsParams: AnalyticsParams = {
    moduleId: props.id,
    moduleName: props.title,
    from: 'videoModal',
    homeEntryId: props.homeEntryId,
  }

  const onPressCloseModal = () => {
    analytics.logHasDismissedModal({ moduleId: props.moduleId, modalType: ContentTypes.VIDEO })
    props.hideModal()
  }

  return (
    <AppModal
      title={''}
      visible={props.visible}
      isUpToStatusBar
      noPadding
      noPaddingBottom
      scrollEnabled={false}
      customModalHeader={<React.Fragment />}>
      <VideoPlayer
        youtubeVideoId={props.youtubeVideoId}
        offer={!props.isMultiOffer ? props.offers[0] : undefined}
        onPressSeeOffer={props.hideModal}
        moduleId={props.moduleId}
        moduleName={props.title}
        homeEntryId={props.homeEntryId}
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
        {!!props.videoDescription && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <StyledBody>{props.videoDescription}</StyledBody>
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={6} />
        <Typo.Title4>{props.offerTitle}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        {!props.isMultiOffer ? (
          <VideoMonoOfferTile
            offer={props.offers[0]}
            color={props.color}
            hideModal={props.hideModal}
            analyticsParams={analyticsParams}
          />
        ) : (
          <VideoMultiOfferList
            offers={props.offers}
            hideModal={props.hideModal}
            analyticsParams={analyticsParams}
          />
        )}
      </StyledScrollView>
      <StyledTouchable onPress={onPressCloseModal} accessibilityLabel="Fermer la modale vidéo">
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
