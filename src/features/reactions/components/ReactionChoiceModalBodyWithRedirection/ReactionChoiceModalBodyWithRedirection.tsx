import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import FastImage, { Source } from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { OfferImageBasicProps } from 'features/reactions/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
// eslint-disable-next-line no-restricted-imports

type Props = {
  offerImages: OfferImageBasicProps[]
}

export const ReactionChoiceModalBodyWithRedirection: FunctionComponent<Props> = ({
  offerImages,
}) => {
  const offerImagesWithUrl = offerImages.filter((offerImage) => offerImage.imageUrl !== '')
  const thumbsImage: Source = { uri: 'src/features/reactions/images/thumbs.png' }

  return (
    <Container gap={6}>
      {offerImagesWithUrl.length > 0 ? (
        <GradientContainer>
          <ImagesContainerGradient />
          <ImagesContainer gap={2} testID="imagesContainer">
            {offerImages.map((offerImage, index) => (
              <OfferImage
                key={index}
                imageUrl={offerImage.imageUrl}
                categoryId={offerImage.categoryId}
                withContainerStroke
              />
            ))}
          </ImagesContainer>
        </GradientContainer>
      ) : (
        <ThumbsImageContainer testID="thumbsImage">
          <ThumbsImage source={thumbsImage} resizeMode="cover" />
        </ThumbsImageContainer>
      )}
      <Typo.Title3 {...getHeadingAttrs(2)}>
        Qu’as-tu pensé de tes dernières réservations&nbsp;?
      </Typo.Title3>
    </Container>
  )
}

const Container = styled(ViewGap)({
  textAlign: 'center',
  paddingVertical: getSpacing(6),
})

const GradientContainer = styled.View({
  width: '100%',
})

const ImagesContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const ImagesContainerGradient = styled(LinearGradient).attrs({
  colors: [
    '#FFF',
    'rgba(255, 255, 255, 0.75)',
    'rgba(255, 255, 255, 0.00)',
    'rgba(255, 255, 255, 0.00)',
    'rgba(255, 255, 255, 0.75)',
    '#FFF',
  ],
  locations: [0, 0.12, 0.25, 0.75, 0.87, 1], // Positions des transitions
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})({
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

const ThumbsImage = styled(FastImage)({
  width: 210,
})
