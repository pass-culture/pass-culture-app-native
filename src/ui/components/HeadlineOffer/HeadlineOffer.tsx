import colorAlpha from 'color-alpha'
import React, { PropsWithChildren } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { TypoDS, getSpacing } from 'ui/theme'

type HeadlineOfferProps = PropsWithChildren & {
  imageUrl: string
  categoryId: CategoryIdEnum
  category: string
  offerTitle: string
  price: string
}

export const HeadlineOffer = ({
  imageUrl,
  categoryId,
  category,
  offerTitle,
  price,
}: HeadlineOfferProps) => {
  return (
    <Container>
      <BackgroundImage url={imageUrl} />
      <Gradient />
      <StyledHorizontalTile categoryId={categoryId} imageUrl={imageUrl}>
        <InfoContainer>
          <LightGreyText>{category}</LightGreyText>
          <Title numberOfLines={2}>{offerTitle}</Title>
          <LightGreyText>{price}</LightGreyText>
        </InfoContainer>
      </StyledHorizontalTile>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.tile,
  overflow: 'hidden',
  height: 245,
  width: '100%',
  justifyContent: 'end',
  padding: getSpacing(4),
}))

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.uniqueColors.specificGrey, 0), theme.uniqueColors.specificGrey],
  locations: [-0.4063, 0.7386],
  pointerEvents: 'none',
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
}))({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  zIndex: 1,
})

const StyledHorizontalTile = styled(HorizontalTile)({
  position: 'relative',
  zIndex: 2,
})

const InfoContainer = styled.View({
  flex: 1,
})

const LightGreyText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))

const Title = styled(TypoDS.BodyAccent)(({ theme }) => ({
  color: theme.colors.white,
}))

const BackgroundImage = styled(Image).attrs({
  resizeMode: 'cover',
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
})
