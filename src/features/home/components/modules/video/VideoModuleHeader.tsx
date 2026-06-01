import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { Offer } from 'shared/offer/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
    thematicHomeEntryId,
    thematicHomeTitle,
    moduleId,
  } = params

  const hasThematicHomeEntry = !!(thematicHomeEntryId && thematicHomeTitle)

  return (
    <React.Fragment>
      <StyledTagContainer>
        <Tag label={videoTag} variant={TagVariant.DEFAULT} />
      </StyledTagContainer>

      <Typo.Title3 {...getHeadingAttrs(1)}>{moduleName}</Typo.Title3>

      <StyledCaptionDate>{`Publiée le ${formatToFrenchDate(
        new Date(videoPublicationDate)
      )}`}</StyledCaptionDate>

      {videoDescription ? (
        <VideoDescriptionContainer>
          <StyledBody>{videoDescription}</StyledBody>
        </VideoDescriptionContainer>
      ) : null}

      <OfferTitleContainer>
        <Typo.Title4 {...getHeadingAttrs(2)}>{offerTitle}</Typo.Title4>
      </OfferTitleContainer>

      {!isMultiOffer && offers[0] && !hasThematicHomeEntry ? (
        <VideoMonoOfferTileContainer>
          <VideoMonoOfferTile
            offer={offers[0]}
            color={color}
            analyticsParams={analyticsParams}
            onPressOffer={handleLogHasDismissedModal}
          />
        </VideoMonoOfferTileContainer>
      ) : null}

      {hasThematicHomeEntry ? (
        <VideoMonoOfferTileContainer>
          <InternalTouchableLink
            navigateTo={{
              screen: 'ThematicHome',
              params: {
                homeId: thematicHomeEntryId,
                from: 'videoModule',
                moduleId,
              },
            }}
            accessibilityLabel={getComputedAccessibilityLabel(thematicHomeTitle)}
            accessibilityRole={accessibilityRoleInternalNavigation()}>
            <AttachedThematicCard title={thematicHomeTitle ?? ''} />
          </InternalTouchableLink>
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
