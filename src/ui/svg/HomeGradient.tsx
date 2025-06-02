import * as React from 'react'
import { Circle, ClipPath, Defs, FeFlood, FeGaussianBlur, Filter, G, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export interface HomeGradientProps extends AccessibleIcon {
  colors: ColorsEnum[]
  width?: number
  height?: number
}

const HomeGradientSvg: React.FunctionComponent<HomeGradientProps> = ({
  accessibilityLabel,
  testID,
  colors,
  width,
  height,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier()
  const { id: filterId1, fill: filterPath1 } = svgIdentifier()
  const { id: filterId2, fill: filterPath2 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={width}
      height={height}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      viewBox="0 0 375 180"
      preserveAspectRatio="none"
      fill="none">
      <G clip-path={clipPath}>
        <G opacity="0.9" filter={filterPath1}>
          <Circle cx="345.5" cy="-17.5" r="193.5" fill={colors[0]} />
        </G>
        <G opacity="0.9" filter={filterPath2}>
          <Circle cx="53" cy="-56" r="164" fill={colors[1]} />
        </G>
      </G>
      <Defs>
        <Filter
          id={filterId1}
          x="2"
          y="-361"
          width="687"
          height="687"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_3901_37" />
        </Filter>
        <Filter
          id={filterId2}
          x="-261"
          y="-370"
          width="628"
          height="628"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_3901_37" />
        </Filter>
        <ClipPath id={clipPathId}>
          <Rect width="375" height="180" fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const HomeGradient = styled(HomeGradientSvg).attrs(({ width }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: width ?? '100%',
}))``
