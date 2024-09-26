import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import thumbs from 'features/reactions/images/thumbs.png'
import { OfferImageBasicProps } from 'features/reactions/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offerImages: OfferImageBasicProps[]
}

export const ReactionChoiceModalBodyWithRedirection: FunctionComponent<Props> = ({
  offerImages,
}) => {
  const offerImagesWithUrl = offerImages.filter((offerImage) => offerImage.imageUrl !== '')

  return (
    <React.Fragment>
      {offerImagesWithUrl.length > 0 ? (
        <GradientContainer>
          <Spacer.Column numberOfSpaces={6} />
          {offerImagesWithUrl.length > 4 ? <ImagesContainerGradient /> : null}
          <ImagesContainer gap={2} testID="imagesContainer">
            {offerImages.map((offerImage, index) => (
              <OfferImage
                key={index}
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

      <Spacer.Column numberOfSpaces={6} />
      <StyledTitle3 {...getHeadingAttrs(2)}>
        Qu’as-tu pensé de tes dernières réservations&nbsp;?
      </StyledTitle3>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

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

const ThumbsImage = styled(Image)({
  width: 210,
  height: '100%',
  marginTop: getSpacing(4),
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})
