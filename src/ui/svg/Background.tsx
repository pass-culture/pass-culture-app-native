import React, { FunctionComponent, memo } from 'react'
import { Defs, LinearGradient, Stop, Path, G, Mask, Use } from 'react-native-svg'
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
    <BackgroundSvg height={height} width={width} />
  </BackgroundContainer>
)

export const BackgroundWithDefaultStatusBar = memo(NotMemoizedBackground)

const NotMemoizedBackgroundWithWhiteStatusBar: FunctionComponent<Props> = (props) => {
  useWhiteStatusBar()
  return <BackgroundWithDefaultStatusBar {...props} />
}

export const BackgroundWithWhiteStatusBar = memo(NotMemoizedBackgroundWithWhiteStatusBar)

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

function BackgroundSvg({ width = '100%', height = '100%' }: Props) {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: ida, xlinkHref: xlinkHrefa } = svgIdentifier()
  const { id: idb, fill: fillb } = svgIdentifier()
  const { id: idc, fill: fillc } = svgIdentifier()
  const { id: idd, fill: filld } = svgIdentifier()
  const { id: ide, xlinkHref: xlinkHrefe } = svgIdentifier()
  return (
    <AccessibleSvg width={width} height={height} viewBox="0 0 375 667" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={idb} x1="65.805%" x2="47.731%" y1="26.588%" y2="116.28%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={secondary} />
        </LinearGradient>
        <LinearGradient id={idd} x1="29.678%" x2="32.571%" y1="71.761%" y2="14.036%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={secondary} />
        </LinearGradient>
        <Path id={ida} d="M0 0h375v667H0z" />
        <Path
          id={ide}
          d="M574.848 685.018c44.64 237.462 197.943-58.73 172.765-186.83-25.178-128.1-120.317-395.218-387.196-385.031-266.88 10.187-281.873 242.282-174.83 360.46 107.043 118.179 344.621-26.06 389.26 211.401z"
        />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id={idc} fill="#fff">
          <Use xlinkHref={xlinkHrefa} />
        </Mask>
        <Use fill={fillb} transform="matrix(-1 0 0 1 375 0)" xlinkHref={xlinkHrefa} />
        <G mask={fillc}>
          <Use fill={filld} transform="rotate(-150 256.422 462.025)" xlinkHref={xlinkHrefe} />
        </G>
      </G>
    </AccessibleSvg>
  )
}
