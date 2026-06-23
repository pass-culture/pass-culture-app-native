import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { ReactionTypeEnum, VenueResponse } from 'api/gen'
import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { ADVICE_CARD_WIDTH, OFFER_ADVICE_THUMBNAIL_HEIGHT } from 'features/advices/constants'
import { AdviceCardData } from 'features/advices/types'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  advicesCardData: AdviceCardData[]
  nbAdvices: number
  onShowWritersModal: () => void
  onPressAdviceCardSeeMore?: (offerId: number) => void
  onPressAllAdvicesButton?: () => void
  onFeedbackLog: (type: ReactionTypeEnum) => void
}

export const VenueAdvicesSection: FunctionComponent<Props> = ({
  venue,
  advicesCardData,
  nbAdvices,
  onShowWritersModal,
  onPressAdviceCardSeeMore,
  onPressAllAdvicesButton,
  onFeedbackLog,
}) => {
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  return (
    <Container gap={4}>
      <Gutter>
        <StyledTitle3 {...getHeadingAttrs(3)} numberOfLines={2}>
          {`Les avis par “${venue.name}”`}
        </StyledTitle3>
      </Gutter>
      <StyledAdviceCardList
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressAdviceCardSeeMore}
        thumbnailHeight={OFFER_ADVICE_THUMBNAIL_HEIGHT}
      />
      {shouldDisplayAllAdvicesButton ? (
        <Gutter>
          <View>
            <InternalTouchableLink
              as={Button}
              wording={`Lire les ${nbAdvices} avis`}
              navigateTo={{ screen: 'ProAdvicesVenue', params: { venueId: venue.id } }}
              variant="secondary"
              color="neutral"
              size="small"
              onBeforeNavigate={onPressAllAdvicesButton}
            />
          </View>
        </Gutter>
      ) : null}
      <Gutter>
        <Button
          wording="Qui écrit les avis des pros&nbsp;?"
          icon={InfoPlain}
          onPress={onShowWritersModal}
          variant="tertiary"
          color="neutral"
          size="small"
        />
      </Gutter>
      <Gutter>
        <FeedBack
          storageKey="venue_advices_feedback"
          likeQuiz="https://passculture.qualtrics.com/jfe/form/SV_eW1XQ60mF3KAMdg"
          dislikeQuiz="https://passculture.qualtrics.com/jfe/form/SV_d1niW3WPCivA6wK"
          title="Trouves-tu ces avis utiles&nbsp;?"
          onLogReaction={onFeedbackLog}
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

const StyledTitle3 = styled(Typo.Title3)({
  flexShrink: 1,
})

const StyledAdviceCardList = styled(AdviceCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
  },
  cardWidth: ADVICE_CARD_WIDTH,
  snapToInterval: ADVICE_CARD_WIDTH,
}))``
