import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'

interface Props {
  imageUrl: string | undefined
  category?: CategoryNameEnum | null
}

export const OfferImage: React.FC<Props> = ({ category, imageUrl }) => {
  if (imageUrl)
    return (
      <ShadowContainer>
        <Image resizeMode="cover" source={{ uri: imageUrl }} />
      </ShadowContainer>
    )

  const CategoryIcon = mapCategoryToIcon(category || null)

  return (
    <ShadowContainer>
      <StyledLinearGradient colors={[ColorsEnum.GREY_LIGHT, ColorsEnum.GREY_MEDIUM]}>
        <CategoryIcon size={getSpacing(10)} color={ColorsEnum.GREY_MEDIUM} />
      </StyledLinearGradient>
    </ShadowContainer>
  )
}

const borderRadius = 4
const width = getSpacing(16)
const height = getSpacing(24) // ratio 2/3

const Image = styled.Image({ borderRadius, height, width })
const ShadowContainer = styled.View({
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

const StyledLinearGradient = styled(LinearGradient)({
  borderRadius,
  height,
  width,
  alignItems: 'center',
  justifyContent: 'center',
})
