import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

function FestivalSvg({
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
      fill={color}
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
        clipRule="evenodd"
        fillRule="evenodd"
        d="M48 53.24H73.459C73.7113 66.8191 76.4165 82.1493 77.56 88H64.8793C54.3176 80.0528 49.9794 62.1572 49.94 61.98C49.7 61 48.74 60.32 47.76 60.46C46.76 60.58 46 61.42 46 62.44V87.98H18.4198C19.5627 82.1512 22.284 66.8159 22.5404 53.24H47.9945L48 53.24ZM47.9834 92C47.9889 92 47.9944 92 48 92C48.0049 92 48.0098 92 48.0147 92H64.2454C64.2503 92 64.2551 92 64.26 92C64.2648 92 64.2696 92 64.2743 92H80C80.6 92 81.18 91.72 81.56 91.28C81.94 90.8 82.08 90.18 81.96 89.6C81.9585 89.592 81.9512 89.5561 81.9384 89.4934C81.6 87.8348 77.44 67.4481 77.44 51.24C77.44 50.8961 77.352 50.5718 77.1975 50.2884C76.9744 49.872 76.6053 49.5358 76.14 49.36C66.34 45.68 52.5 28 50 24.72V14.72V14.52V6.00001C50 5.38001 49.72 4.80001 49.22 4.40001C48.72 4.02001 48.08 3.90001 47.48 4.06001L31.48 8.36001C30.6 8.60001 30 9.38001 30 10.3C30 11.22 30.6 12 31.48 12.24L46 16.14V24.7243C43.5108 27.9702 29.9635 45.2758 20.2063 49.2515C19.2734 49.4196 18.5598 50.2405 18.5598 51.22C18.5598 67.4281 14.3999 87.8147 14.0614 89.4734L14.0613 89.474C14.0486 89.5363 14.0413 89.572 14.0398 89.58C13.9198 90.18 14.0598 90.8 14.4398 91.26C14.8198 91.72 15.3998 92 15.9998 92H47.9834ZM58.9007 88H50V74.18C52.0365 78.7357 54.949 83.883 58.9007 88ZM67.98 49.24H48.0055L47.9999 49.24H28.0399C36.1895 43.2342 44.5627 33.0789 48.0089 28.6835C51.4506 33.0789 59.8147 43.2342 67.98 49.24ZM39.7 10.3L46 12V8.60001L39.7 10.3Z"
      />
    </AccessibleSvg>
  )
}

export const Festival = styled(FestivalSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
