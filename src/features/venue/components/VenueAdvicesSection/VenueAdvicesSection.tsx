import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { ADVICE_CARD_WIDTH } from 'features/advices/constants'
import { AdviceCardData } from 'features/advices/types'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  advicesCardData: AdviceCardData[]
  nbAdvices: number
  onShowWritersModal: () => void
  onPressAdviceCardSeeMore?: (offerId: number) => void
  enableNewTagProAdvices?: boolean
}

export const VenueAdvicesSection: FunctionComponent<Props> = ({
  venue,
  advicesCardData,
  nbAdvices,
  onShowWritersModal,
  onPressAdviceCardSeeMore,
  enableNewTagProAdvices,
}) => {
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  return (
    <Container gap={4}>
      <Gutter>
        <Row>
          <StyledTitle3 {...getHeadingAttrs(3)} numberOfLines={2}>
            {`Les avis par “${venue.name}”`}
          </StyledTitle3>
          {enableNewTagProAdvices ? (
            <TagContainer>
              <Tag variant={TagVariant.NEW} label="Nouveau" />
            </TagContainer>
          ) : null}
        </Row>
      </Gutter>
      <StyledAdviceCardList
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressAdviceCardSeeMore}
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

const TagContainer = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  flexShrink: 0,
}))
