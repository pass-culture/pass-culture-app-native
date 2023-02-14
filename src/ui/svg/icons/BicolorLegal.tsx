import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const BicolorLegalSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.33333 3.99998C5.33333 3.2615 5.92819 2.66665 6.66667 2.66665L25.3333 2.66665C26.0718 2.66665 26.6667 3.2615 26.6667 3.99998V19.3933C26.6667 19.7615 26.9651 20.06 27.3333 20.06C27.7015 20.06 28 19.7615 28 19.3933V3.99998C28 2.52512 26.8082 1.33331 25.3333 1.33331L6.66667 1.33331C5.19181 1.33331 4 2.52512 4 3.99998L4 28C4 29.4748 5.19181 30.6666 6.66667 30.6666H25.3333C26.8082 30.6666 28 29.4748 28 28V25.3066C28 24.9385 27.7015 24.64 27.3333 24.64C26.9651 24.64 26.6667 24.9385 26.6667 25.3066V28C26.6667 28.7385 26.0718 29.3333 25.3333 29.3333H6.66667C5.92819 29.3333 5.33333 28.7385 5.33333 28L5.33333 3.99998ZM9.33333 7.33331C8.96514 7.33331 8.66667 7.63179 8.66667 7.99998C8.66667 8.36817 8.96514 8.66665 9.33333 8.66665H22.6667C23.0349 8.66665 23.3333 8.36817 23.3333 7.99998C23.3333 7.63179 23.0349 7.33331 22.6667 7.33331L9.33333 7.33331ZM8.66667 13.3333C8.66667 12.9651 8.96514 12.6666 9.33333 12.6666H22.6667C23.0349 12.6666 23.3333 12.9651 23.3333 13.3333C23.3333 13.7015 23.0349 14 22.6667 14H9.33333C8.96514 14 8.66667 13.7015 8.66667 13.3333ZM9.33333 18C8.96514 18 8.66667 18.2985 8.66667 18.6666C8.66667 19.0348 8.96514 19.3333 9.33333 19.3333H18.6667C19.0349 19.3333 19.3333 19.0348 19.3333 18.6666C19.3333 18.2985 19.0349 18 18.6667 18H9.33333Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorLegal = styled(BicolorLegalSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? theme.colors.secondary,
  size: size ?? theme.icons.sizes.standard,
}))``
