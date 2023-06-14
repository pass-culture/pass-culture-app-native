import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

function DigitalSvg({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      viewBox="0 0 96 96"
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M8 20.04C8 13.5699 12.8287 8 19.18 8H62.02C63.1246 8 64.02 8.89543 64.02 10C64.02 11.1046 63.1246 12 62.02 12H19.18C15.3713 12 12 15.4301 12 20.04V59.96C12 64.5699 15.3713 68 19.18 68H47.9858L47.9994 68L48.0131 68H76.82C80.6114 68 84 64.567 84 59.96V20.04C84 15.4301 80.6287 12 76.82 12H75.24C74.1354 12 73.24 11.1046 73.24 10C73.24 8.89543 74.1354 8 75.24 8H76.82C83.1713 8 88 13.5699 88 20.04V59.96C88 66.433 83.1486 72 76.82 72H49.9994V83.9999H64.9994C66.104 83.9999 66.9994 84.8954 66.9994 85.9999C66.9994 87.1045 66.104 88 64.9994 88H42.9994C41.8949 88 40.9994 87.1045 40.9994 85.9999C40.9994 84.8954 41.8949 83.9999 42.9994 83.9999H45.9994V72H19.18C12.8287 72 8 66.4301 8 59.96V20.04ZM30 83.9999C28.8954 83.9999 28 84.8954 28 85.9999C28 87.1045 28.8954 88 30 88H34C35.1046 88 36 87.1045 36 85.9999C36 84.8954 35.1046 83.9999 34 83.9999H30ZM58.015 36.8911L45.0428 30.3751C42.7146 29.1932 40.0006 30.9099 40.0006 33.48V46.54C40.0006 49.11 42.7145 50.8267 45.0426 49.645L58.0183 43.1272L58.0184 43.1273L58.0412 43.1155C60.5332 41.8233 60.5955 38.1833 58.0169 36.8921L58.015 36.8911ZM55.3126 40.01L44.0006 34.3278V45.6922L55.3126 40.01Z"
      />
    </AccessibleSvg>
  )
}

export const Digital = styled(DigitalSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
