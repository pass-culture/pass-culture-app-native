import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const PressSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="18.271%" x2="81.729%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M10 4C8.89228 4 8 4.89228 8 6V31.12C8 31.6723 7.55228 32.12 7 32.12C6.44772 32.12 6 31.6723 6 31.12V6C6 3.78772 7.78772 2 10 2H30C32.2123 2 34 3.78772 34 6V8.86C34 9.41228 33.5523 9.86 33 9.86C32.4477 9.86 32 9.41228 32 8.86V6C32 4.89228 31.1077 4 30 4H10ZM12.5 11C11.9477 11 11.5 11.4477 11.5 12C11.5 12.5523 11.9477 13 12.5 13H24.5C25.0523 13 25.5 12.5523 25.5 12C25.5 11.4477 25.0523 11 24.5 11H12.5ZM12.5 17C11.9477 17 11.5 17.4477 11.5 18C11.5 18.5523 11.9477 19 12.5 19H25.5C26.0523 19 26.5 18.5523 26.5 18C26.5 17.4477 26.0523 17 25.5 17H12.5ZM11.5 24C11.5 23.4477 11.9477 23 12.5 23H23.5C24.0523 23 24.5 23.4477 24.5 24C24.5 24.5523 24.0523 25 23.5 25H12.5C11.9477 25 11.5 24.5523 11.5 24ZM34 15C34 14.4477 33.5523 14 33 14C32.4477 14 32 14.4477 32 15V41C32 42.1258 32.3717 43.1644 32.9991 44H15C11.1323 44 8 40.8677 8 37C8 36.4477 7.55228 36 7 36C6.44772 36 6 36.4477 6 37C6 41.9723 10.0277 46 15 46H37C39.7623 46 42 43.7623 42 41V23C42 21.3477 40.6523 20 39 20H37C36.4477 20 36 20.4477 36 21C36 21.5523 36.4477 22 37 22H39C39.5477 22 40 22.4523 40 23V41C40 42.6577 38.6577 44 37 44C35.3423 44 34 42.6577 34 41V15Z"
      />
    </AccessibleSvg>
  )
}

export const Press = styled(PressSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
