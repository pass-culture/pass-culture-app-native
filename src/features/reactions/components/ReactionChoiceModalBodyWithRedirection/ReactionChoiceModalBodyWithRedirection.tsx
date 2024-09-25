import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferImageBasicProps } from 'features/reactions/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'
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
      ) : null}
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

const ImagesContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})
