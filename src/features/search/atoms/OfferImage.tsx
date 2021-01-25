import React from 'react'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { ImagePlaceholder } from 'features/offer/atoms/ImagePlaceholder'
import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'

interface Props {
  imageUrl: string | undefined
  categoryName?: CategoryNameEnum | null
}

export const OfferImage: React.FC<Props> = ({ categoryName, imageUrl }) => (
  <Container>
    {imageUrl ? (
      <Image resizeMode="cover" source={{ uri: imageUrl }} />
    ) : (
      <ImagePlaceholder
        categoryName={categoryName || null}
        size={getSpacing(10)}
        borderRadius={borderRadius}
      />
    )}
  </Container>
)

const borderRadius = 4
const width = getSpacing(16)
const height = getSpacing(24) // ratio 2/3

const Image = styled.Image({ borderRadius, height, width })
const Container = styled.View({
  width,
  height,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1),
    },
    shadowRadius: getSpacing(1),
    shadowColor: ColorsEnum.GREY_DARK,
    shadowOpacity: 0.2,
  }),
})
