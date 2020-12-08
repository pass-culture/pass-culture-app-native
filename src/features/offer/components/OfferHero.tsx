import React from 'react'
import { Dimensions, Platform } from 'react-native'
import styled from 'styled-components/native'

import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
}

export const OfferHero: React.FC<Props> = ({ imageUrl }) => {
  const { top } = useCustomSafeInsets()
  return (
    <React.Fragment>
      <Image
        extraHeight={top}
        blurRadius={Platform.OS === 'android' ? 5 : 20}
        resizeMode={'cover'}
        source={{ uri: imageUrl }}
      />
      {/** Add 1 pixel to avoid 1 white pixel on androids */}
      <Rectangle size={screenWidth + 1} />
    </React.Fragment>
  )
}
const screenWidth = Dimensions.get('window').width

const Image = styled.Image<{ extraHeight: number }>(({ extraHeight }) => ({
  height: getSpacing(78) + extraHeight,
  width: screenWidth,
}))
