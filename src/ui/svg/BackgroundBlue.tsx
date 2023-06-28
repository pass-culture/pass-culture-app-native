import React, { FunctionComponent, memo } from 'react'
import { Defs, LinearGradient, Stop, Path, G, Use } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { useWhiteStatusBar } from 'libs/hooks/useWhiteStatusBar'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

type Props = {
  width?: string | number
  height?: string | number
  chidren?: never
}

const NotMemoizedBackground: FunctionComponent<Props> = ({ width = '100%', height = '100%' }) => (
  <BackgroundContainer height={height} width={width}>
    <BackgroundBlueSvg height={height} width={width} />
  </BackgroundContainer>
)

export const BackgroundBlueWithDefaultStatusBar = memo(NotMemoizedBackground)

const NotMemoizedBackgroundWithWhiteStatusBar: FunctionComponent<Props> = (props) => {
  useWhiteStatusBar()
  return <BackgroundBlueWithDefaultStatusBar {...props} />
}

export const BackgroundBlueWithWhiteStatusBar = memo(NotMemoizedBackgroundWithWhiteStatusBar)

const BackgroundContainer = styled.View<Props>(({ width, height, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: width ?? '100%',
  height: height ?? '100%',
  zIndex: theme.zIndex.background,
}))

function BackgroundBlueSvg({ width = '100%', height = '100%' }: Props) {
  const {
    colors: { black, secondary },
  } = useTheme()

  const { id: ida, xlinkHref: xlinkHrefa } = svgIdentifier()
  const { id: idb, fill: fillb } = svgIdentifier()

  return (
    <AccessibleSvg width={width} height={height} viewBox="0 0 375 667" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={idb} x1="65.805%" x2="47.731%" y1="26.588%" y2="116.28%">
          <Stop offset="0%" stopColor={secondary} />
          <Stop offset="100%" stopColor={black} />
        </LinearGradient>
        <Path id={ida} d="M0 0h375v667H0z" />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Use fill={fillb} transform="matrix(-1 0 0 1 375 0)" xlinkHref={xlinkHrefa} />
      </G>
    </AccessibleSvg>
  )
}
