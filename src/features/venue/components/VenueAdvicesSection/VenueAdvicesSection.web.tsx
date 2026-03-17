import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { styled, useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleCardData } from 'features/chronicle/type'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Show } from 'ui/svg/icons/Show'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  advicesCardData: ChronicleCardData[]
  nbAdvices: number
  onShowWritersModal: () => void
  onPressChronicleCardSeeMore?: () => void
  enableNewTagProAdvices?: boolean
}

export const VenueAdvicesSection: FunctionComponent<Props> = ({
  venue,
  advicesCardData,
  nbAdvices,
  onShowWritersModal,
  onPressChronicleCardSeeMore,
  enableNewTagProAdvices,
}) => {
  const theme = useTheme()
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  const TitleContent = (
    <Row>
      <StyledTitle3
        {...getHeadingAttrs(3)}
        numberOfLines={2}
        enableNewTagProAdvices={enableNewTagProAdvices}>
        {`Les avis par “${venue.name}”`}
      </StyledTitle3>

      {enableNewTagProAdvices ? (
        <TagContainer shouldDisplayAllAdvicesButton={shouldDisplayAllAdvicesButton}>
          <Tag variant={TagVariant.NEW} label="Nouveau" />
        </TagContainer>
      ) : null}

      {theme.isDesktopViewport && shouldDisplayAllAdvicesButton ? (
        <SeeAllAdvicesContainerDesktop testID="allAdvicesButtonDesktop">
          <InternalTouchableLink
            as={Button}
            icon={Show}
            wording={`Lire les ${nbAdvices} avis`}
            navigateTo={{ screen: 'Chronicles' }}
            variant="tertiary"
            color="neutral"
          />
        </SeeAllAdvicesContainerDesktop>
      ) : null}
    </Row>
  )

  return (
    <Container gap={4}>
      <Gutter>{TitleContent}</Gutter>

      <StyledChronicleCardlist
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressChronicleCardSeeMore}
        shouldDisplayAllAdvicesButton={shouldDisplayAllAdvicesButton}
      />

      {shouldDisplayAllAdvicesButton && !theme.isDesktopViewport ? (
        <Gutter>
          <View testID="allAdvicesButtonMobile">
            <InternalTouchableLink
              as={Button}
              wording={`Lire les ${nbAdvices} avis`}
              // TODO(PC-40227): add pro advices page
              navigateTo={{ screen: 'Chronicles' }}
              variant="secondary"
              color="neutral"
              size="small"
            />
          </View>
        </Gutter>
      ) : null}

      <Gutter>
        <WritersButtonContainer>
          <Button
            wording="Qui écrit les avis des pros&nbsp;?"
            icon={InfoPlain}
            onPress={onShowWritersModal}
            variant="tertiary"
            color="neutral"
            size="small"
          />
        </WritersButtonContainer>
      </Gutter>

      <Gutter>
        <StyledFeedback
          storageKey="venue_advices_feedback"
          likeQuiz="https://passculture.qualtrics.com/jfe/form/SV_eW1XQ60mF3KAMdg"
          dislikeQuiz="https://passculture.qualtrics.com/jfe/form/SV_d1niW3WPCivA6wK"
          title="Trouves-tu ces avis utiles&nbsp;?"
          // TODO(PC-39762): add tracking
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onLogReaction={() => {}}
        />
      </Gutter>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const Gutter = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledTitle3 = styled(Typo.Title3)<{ enableNewTagProAdvices?: boolean }>(
  ({ theme, enableNewTagProAdvices }) => ({
    flexShrink: 1,
    ...(!enableNewTagProAdvices && theme.isDesktopViewport
      ? {
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.designSystem.color.border.default,
          paddingRight: theme.designSystem.size.spacing.s,
        }
      : {}),
  })
)

const SeeAllAdvicesContainerDesktop = styled.View(({ theme }) => ({
  width: 'auto',
  borderWidth: 0,
  paddingLeft: theme.designSystem.size.spacing.s,
}))

const StyledChronicleCardlist = styled(ChronicleCardList).attrs<{
  shouldDisplayAllAdvicesButton: boolean
}>(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
}))``

const TagContainer = styled.View<{ shouldDisplayAllAdvicesButton: boolean }>(
  ({ theme, shouldDisplayAllAdvicesButton }) => ({
    marginLeft: theme.designSystem.size.spacing.s,
    ...(theme.isDesktopViewport && shouldDisplayAllAdvicesButton
      ? {
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.designSystem.color.border.default,
          paddingRight: theme.designSystem.size.spacing.s,
        }
      : {}),
    flexShrink: 0,
  })
)

const StyledFeedback = styled(FeedBack)(({ theme }) => ({
  width: theme.isDesktopViewport ? '50%' : '100%',
}))

const WritersButtonContainer = styled.View(({ theme }) => ({
  alignSelf: theme.isDesktopViewport ? 'flex-start' : undefined,
}))
