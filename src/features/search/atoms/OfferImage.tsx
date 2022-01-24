import React from 'react'
import { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getShadow, getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface Props {
  imageUrl: string | undefined
  categoryId?: CategoryIdEnum | null
}

export const OfferImage: React.FC<Props> = ({ categoryId, imageUrl }) => {
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])
  const Icon = mapCategoryToIcon(categoryId || null)

  return (
    <Container>
      {imageUrl ? (
        <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
      ) : (
        <ImagePlaceholder
          backgroundColors={backgroundColors}
          Icon={Icon}
          size={getSpacing(10)}
          borderRadius={borderRadius}
        />
      )}
    </Container>
  )
}

const borderRadius = 4
const width = getSpacing(16)
const height = getSpacing(24) // ratio 2/3
const backgroundColors = [ColorsEnum.GREY_LIGHT, ColorsEnum.GREY_MEDIUM]

const imageStyle = { borderRadius, height, width }

const Container = styled.View({
  width,
  height,
  borderRadius,
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
