import * as React from 'react'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { HomeGradientProps } from 'ui/svg/HomeGradient'
import { svgIdentifier } from 'ui/svg/utils'
import { getSpacing } from 'ui/theme'

const HomeGradientSvg: React.FunctionComponent<HomeGradientProps> = ({
  accessibilityLabel,
  testID,
  colors,
  width = '1024',
}) => {
  const { id: filterId, fill: filterPath } = svgIdentifier()
  const { id: gradientId1, fill: gradientPath1 } = svgIdentifier()
  const { id: gradientId2, fill: gradientPath2 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={width}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      height="180"
      viewBox="0 0 383 188"
      preserveAspectRatio="none"
      fill="none">
      <g filter={filterPath} width="100%">
        <path d="M4 4H379V184H4V4Z" fill={gradientPath1} />
        <path d="M4 4H379V184H4V4Z" fill={gradientPath2} />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="383"
          height="188"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_3903_52" />
        </filter>
        <radialGradient
          id={gradientId1}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(393.5 -102) rotate(128.908) scale(396.451 396.451)">
          <stop offset="0.281606" stopColor={colors[0]} />
          <stop offset="0.9999" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradientId2}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(4 -31.5) rotate(41.2509) scale(373.09 373.09)">
          <stop stopColor={colors[1]} />
          <stop offset="0.9999" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </AccessibleSvg>
  )
}

export const HomeGradient = styled(HomeGradientSvg).attrs(({ width, height }) => ({
  width: width ?? '100%',
  height: height ?? getSpacing(45),
}))``
