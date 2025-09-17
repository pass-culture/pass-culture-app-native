import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  ArrowRightIcon,
  LightGreyText,
  Title,
} from 'features/headlineOffer/components/HeadlineOffer/CommonHeadlineOffer.styles'
import { HeadlineOfferData } from 'features/headlineOffer/type'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'

export const HeadlineOfferSmallViewport: FunctionComponent<HeadlineOfferData> = ({
  imageUrl,
  distance,
  categoryId,
  category,
  price,
  offerTitle,
}) => (
  <Container>
    {distance ? <Tag label={`à ${distance}`} /> : null}
    <StyledHorizontalTile categoryId={categoryId} imageUrl={imageUrl}>
      <TileContent>
        <ContentContainer>
          <LightGreyText>{category}</LightGreyText>
          <Title numberOfLines={2}>{offerTitle}</Title>
          <LightGreyText>{price}</LightGreyText>
        </ContentContainer>
      </TileContent>
      <IconContainer>
        <ArrowRightIcon />
      </IconContainer>
    </StyledHorizontalTile>
  </Container>
)

const Container = styled.View(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.designSystem.size.spacing.l,
  flex: 1,
}))

const StyledHorizontalTile = styled(HorizontalTile)({
  marginTop: 'auto',
})

const TileContent = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ContentContainer = styled.View({
  justifyContent: 'center',
  flexShrink: 1,
})

const IconContainer = styled.View({
  alignSelf: 'flex-end',
})
