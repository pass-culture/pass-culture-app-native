import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const PhoneIconSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0002 2.66659C9.26169 2.66659 8.66683 3.26144 8.66683 3.99992V6.83325C8.66683 7.20144 8.36835 7.49992 8.00016 7.49992C7.63197 7.49992 7.3335 7.20144 7.3335 6.83325V3.99992C7.3335 2.52506 8.52531 1.33325 10.0002 1.33325H16.0002H22.0002C23.475 1.33325 24.6668 2.52506 24.6668 3.99992V26.6666V27.9999C24.6668 29.4748 23.475 30.6666 22.0002 30.6666H10.0002C8.52531 30.6666 7.3335 29.4748 7.3335 27.9999V10.6666C7.3335 10.2984 7.63197 9.99992 8.00016 9.99992C8.36835 9.99992 8.66683 10.2984 8.66683 10.6666V25.9999H16.6668C17.035 25.9999 17.3335 26.2984 17.3335 26.6666C17.3335 27.0348 17.035 27.3333 16.6668 27.3333H8.66683V27.9999C8.66683 28.7384 9.26169 29.3333 10.0002 29.3333H22.0002C22.7386 29.3333 23.3335 28.7384 23.3335 27.9999V27.3333H20.6668C20.2986 27.3333 20.0002 27.0348 20.0002 26.6666C20.0002 26.2984 20.2986 25.9999 20.6668 25.9999H23.3335V3.99992C23.3335 3.26144 22.7386 2.66659 22.0002 2.66659H16.6668V3.99992H19.3335C19.7017 3.99992 20.0002 4.2984 20.0002 4.66659C20.0002 5.03478 19.7017 5.33325 19.3335 5.33325H16.0002H12.6668C12.2986 5.33325 12.0002 5.03478 12.0002 4.66659C12.0002 4.2984 12.2986 3.99992 12.6668 3.99992H15.3335V2.66659H10.0002Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="7.3335"
          y1="1.33325"
          x2="22.68"
          y2="26.5653"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const PhoneIcon = styled(PhoneIconSvg).attrs(
  ({ theme, color = theme.colors.black, size = theme.icons.sizes.standard }) => ({
    color,
    size,
  })
)``

export const BicolorPhoneIcon = styled(PhoneIconSvg).attrs(
  ({
    theme,
    color = theme.colors.primary,
    color2 = theme.colors.secondary,
    size = theme.icons.sizes.standard,
  }) => ({
    color,
    color2,
    size,
  })
)``
