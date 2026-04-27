import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'

type Props = {
  analyticsParams: OfferAnalyticsParams
  handleLogHasDismissedModal: () => void
  offers: Offer[]
}

export const VideoModuleHeader: FunctionComponent<Props> = ({
  analyticsParams,
  handleLogHasDismissedModal,
  offers,
}) => {
  const { params } = useRoute<UseRouteType<'VideoModulePage'>>()
  const {
    moduleName,
    isMultiOffer,
    videoTag,
    videoPublicationDate,
    videoDescription,
    offerTitle,
    color,
  } = params

  return (
    <React.Fragment>
      <StyledTagContainer>
        <Tag label={videoTag} variant={TagVariant.DEFAULT} />
      </StyledTagContainer>

      <Typo.Title3>{moduleName}</Typo.Title3>

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
          <VideoMonoOfferTile
            offer={offers[0]}
            color={color}
            analyticsParams={analyticsParams}
            onPressOffer={handleLogHasDismissedModal}
          />
        </VideoMonoOfferTileContainer>
      ) : null}
    </React.Fragment>
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
