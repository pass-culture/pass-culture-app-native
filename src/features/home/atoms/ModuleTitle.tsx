import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, MARGIN_DP } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'

export const ModuleTitle = (props: { title: string; color?: ColorsEnum }) => {
  const { title, color = ColorsEnum.BLACK } = props
  return (
    <Container>
      <Typo.Title3 numberOfLines={2} testID="moduleTitle" color={color}>
        {title}
      </Typo.Title3>
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: PixelRatio.roundToNearestPixel(MARGIN_DP),
})
