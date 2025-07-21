import React, { FunctionComponent } from 'react'
import { FlexStyle } from 'react-native'
import styled from 'styled-components/native'

import { BookingOfferResponse, OfferResponse, ReactionTypeEnum } from 'api/gen'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { useSubcategory } from 'libs/subcategories'
import { Separator } from 'ui/components/Separator'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { OfferName } from 'ui/components/tiles/OfferName'
import { ValidationMark } from 'ui/components/ValidationMark'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse | BookingOfferResponse
  dateUsed: string
  handleOnPressReactionButton: (reactionType: ReactionTypeEnum) => void
  reactionStatus?: ReactionTypeEnum | null
}

export const ReactionChoiceModalBodyWithValidation: FunctionComponent<Props> = ({
  offer,
  dateUsed,
  reactionStatus,
  handleOnPressReactionButton,
}) => {
  const { categoryId } = useSubcategory(offer.subcategoryId)

  return (
    <Container gap={6}>
      <Typo.Title3>Partage-nous ton avis&nbsp;!</Typo.Title3>
      <ViewGap gap={4}>
        <Separator.Horizontal />
        <HorizontalTileContainer gap={4}>
          <HorizontalTile categoryId={categoryId} imageUrl={offer.image?.url}>
            <Column flex={1}>
              <Row>
                <OfferNameContainer>
                  <OfferName title={offer.name} />
                </OfferNameContainer>
              </Row>
              <SubtitleContainer gap={1}>
                <ValidationMark isValid />
                <UsedText>Utilisé</UsedText>
                <DateUsedText>{dateUsed}</DateUsedText>
              </SubtitleContainer>
            </Column>
          </HorizontalTile>
        </HorizontalTileContainer>
        <Separator.Horizontal />
      </ViewGap>
      <StyledReactionChoiceValidation
        reactionStatus={reactionStatus}
        handleOnPressReactionButton={handleOnPressReactionButton}
        likeLabel="J’aime"
        dislikeLabel="Je n’aime pas"
      />
    </Container>
  )
}

const Container = styled(ViewGap)({
  marginTop: getSpacing(6),
})

const HorizontalTileContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const SubtitleContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const UsedText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.success,
}))

const DateUsedText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledReactionChoiceValidation = styled(ReactionChoiceValidation)({
  marginBottom: getSpacing(12),
})

const Flex = styled.View<FlexStyle>(({ flex, justifyContent, alignItems, gap, flexDirection }) => ({
  flexDirection,
  flex,
  alignItems,
  justifyContent,
  gap,
}))

const Column = Flex

const Row = styled(Flex).attrs({
  flexDirection: 'row',
  alignItems: 'center',
})``

const OfferNameContainer = styled.View({
  flexShrink: 1,
})
