import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import {
  ArrowRightIcon,
  LightGreyText,
  Title,
} from 'features/headlineOffer/components/HeadlineOffer/CommonHeadlineOffer.styles'
import { HeadlineOfferData } from 'features/headlineOffer/type'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { Typo } from 'ui/theme'

export const HeadlineOfferLargeViewport: FunctionComponent<HeadlineOfferData> = ({
  imageUrl,
  distance,
  categoryId,
  category,
  price,
  offerTitle,
}) => (
  <Container>
    <HorizontalTile categoryId={categoryId} imageUrl={imageUrl} size="xLarge">
      <InfoContainer gap={4}>
        {distance ? <Tag label={`à ${distance}`} /> : null}
        <View>
          <LightGreyText>{category}</LightGreyText>
          <Title numberOfLines={2}>{offerTitle}</Title>
          <LightGreyText>{price}</LightGreyText>
        </View>
        <IconContainer gap={2}>
          <SeeOfferText>Voir l’offre</SeeOfferText>
          <ArrowRightIcon />
        </IconContainer>
      </InfoContainer>
    </HorizontalTile>
  </Container>
)

const Container = styled.View(({ theme }) => ({
  justifyContent: 'center',
  padding: theme.designSystem.size.spacing.xxl,
  height: '100%',
}))

const InfoContainer = styled(ViewGap)({
  flex: 1,
})

const IconContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const SeeOfferText = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
