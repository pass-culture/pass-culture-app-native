import React, { memo } from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G, Mask, Use } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

export const BackgroundSecondary = memo(NotMemoizedBackground)

function NotMemoizedBackground() {
  return (
    <BackgroundContainer>
      <BackgroundSvg />
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: theme.zIndex.background,
}))

function BackgroundSvg() {
  const {
    uniqueColors: { brand: dark, brandDark: light },
  } = useTheme()
  const { id, fill } = svgIdentifier()
  const { id: id2, xlinkHref: xlinkHref2 } = svgIdentifier()
  const { id: id3 } = svgIdentifier()
  return (
    <Svg width="100%" height="100%" viewBox="0 0 375 667" preserveAspectRatio="none">
      <Defs>
        <LinearGradient
          id={id}
          x1="65.805%"
          x2="47.731%"
          y1="26.588%"
          y2="116.28%"
          gradientTransform="rotate(-30)">
          <Stop offset="0%" stopColor={dark} />
          <Stop offset="100%" stopColor={light} />
        </LinearGradient>
        <Path id={id2} d="M0 0h375v667H0z" />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id={id3} fill="#fff">
          <Use xlinkHref={xlinkHref2} />
        </Mask>
        <Use fill={fill} xlinkHref={xlinkHref2} />
      </G>
    </Svg>
  )
}
