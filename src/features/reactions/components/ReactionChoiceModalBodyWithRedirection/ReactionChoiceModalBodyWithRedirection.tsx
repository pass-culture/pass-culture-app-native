import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import thumbs from 'features/reactions/images/thumbs.png'
import { OfferImageBasicProps } from 'features/reactions/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offerImages: OfferImageBasicProps[]
}

export const ReactionChoiceModalBodyWithRedirection: FunctionComponent<Props> = ({
  offerImages,
}) => {
  const offerImagesWithUrl = offerImages.filter((offerImage) => offerImage.imageUrl !== '')

  return (
    <Container gap={6}>
      {offerImagesWithUrl.length > 0 ? (
        <GradientContainer>
          {offerImagesWithUrl.length > 4 ? (
            <ImagesContainerGradient testID="offerImagesGradient" />
          ) : null}
          <ImagesContainer gap={2} testID="imagesContainer">
            {offerImages.map((offerImage) => (
              <OfferImage
                key={offerImage.imageUrl}
                imageUrl={offerImage.imageUrl}
                categoryId={offerImage.categoryId}
                withContainerStroke={offerImage.imageUrl === ''}
                withShadow={false}
              />
            ))}
          </ImagesContainer>
        </GradientContainer>
      ) : (
        <ThumbsImageContainer testID="thumbsImage">
          <ThumbsImage source={thumbs} resizeMode="cover" />
        </ThumbsImageContainer>
      )}

      <StyledTitle3 {...getHeadingAttrs(2)}>
        Qu’as-tu pensé de tes dernières réservations&nbsp;?
      </StyledTitle3>
    </Container>
  )
}

const Container = styled(ViewGap)({
  marginBottom: getSpacing(6),
})

const GradientContainer = styled.View({
  width: '100%',
  marginTop: getSpacing(6),
})

const ImagesContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const ImagesContainerGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    theme.colors.white,
    colorAlpha(theme.colors.white, 0.75),
    colorAlpha(theme.colors.white, 0.0),
    colorAlpha(theme.colors.white, 0.0),
    colorAlpha(theme.colors.white, 0.75),
    theme.colors.white,
  ],
  locations: [0, 0.12, 0.25, 0.75, 0.87, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))({
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 2,
})

const ThumbsImageContainer = styled.View({
  width: '100%',
  height: 124,
  justifyContent: 'center',
  alignItems: 'center',
})

const ThumbsImage = styled(Image)({
  width: 210,
  height: '100%',
  marginTop: getSpacing(4),
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})
