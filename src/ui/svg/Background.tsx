import React, { memo } from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G, Mask, Use } from 'react-native-svg'
import styled from 'styled-components/native'

import { ZIndex } from 'ui/theme/layers'

export const Background = memo(NotMemoizedBackground)

function NotMemoizedBackground() {
  return (
    <BackgroundContainer>
      <BackgroundSvg />
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: ZIndex.BACKGROUND,
})

function BackgroundSvg() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 375 667" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="bakground__b" x1="65.805%" x2="47.731%" y1="26.588%" y2="116.28%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <LinearGradient id="bakground__d" x1="29.678%" x2="32.571%" y1="71.761%" y2="14.036%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <Path id="bakground__a" d="M0 0h375v667H0z" />
        <Path
          id="bakground__e"
          d="M574.848 685.018c44.64 237.462 197.943-58.73 172.765-186.83-25.178-128.1-120.317-395.218-387.196-385.031-266.88 10.187-281.873 242.282-174.83 360.46 107.043 118.179 344.621-26.06 389.26 211.401z"
        />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id="bakground__c" fill="#fff">
          <Use xlinkHref="#bakground__a" />
        </Mask>
        <Use
          fill="url(#bakground__b)"
          transform="matrix(-1 0 0 1 375 0)"
          xlinkHref="#bakground__a"
        />
        <G mask="url(#bakground__c)">
          <Use
            fill="url(#bakground__d)"
            transform="rotate(-150 256.422 462.025)"
            xlinkHref="#bakground__e"
          />
        </G>
      </G>
    </Svg>
  )
}
