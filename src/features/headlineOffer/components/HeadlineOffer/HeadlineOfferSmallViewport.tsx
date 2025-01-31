import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  ArrowRightIcon,
  InfoContainer,
  LightGreyText,
  Title,
} from 'features/headlineOffer/components/HeadlineOffer/CommonHeadlineOffer.styles'
import { HeadlineOfferBaseProps } from 'features/headlineOffer/components/HeadlineOffer/HeadlineOffer'
import { Tag } from 'ui/components/Tag/Tag'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { getSpacing } from 'ui/theme'

export const HeadlineOfferSmallViewport: FunctionComponent<HeadlineOfferBaseProps> = ({
  imageUrl,
  distance,
  categoryId,
  category,
  price,
  offerTitle,
}) => (
  <Container>
    {distance ? <Tag label={`à ${distance}`} /> : null}
    <TileContainer>
      <HorizontalTile categoryId={categoryId} imageUrl={imageUrl}>
        <ContentContainer>
          <InfoContainer gap={0}>
            <LightGreyText>{category}</LightGreyText>
            <Title numberOfLines={2}>{offerTitle}</Title>
            <LightGreyText>{price}</LightGreyText>
          </InfoContainer>
        </ContentContainer>
        <IconContainer>
          <ArrowRightIcon />
        </IconContainer>
      </HorizontalTile>
    </TileContainer>
  </Container>
)

const Container = styled.View({
  flexDirection: 'column',
  padding: getSpacing(4),
  height: '100%',
})

const TileContainer = styled.View({
  flexGrow: 1,
  justifyContent: 'flex-end',
})

const ContentContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const IconContainer = styled.View({
  flex: 1,
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  height: '100%',
})
