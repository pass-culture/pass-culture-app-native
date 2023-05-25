import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const EmailIconSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      viewBox="0 0 32 33"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.66683 5.33211C3.599 5.33211 2.66683 6.26185 2.66683 7.49878L2.66683 24.4988C2.66683 24.5914 2.67206 24.6824 2.68219 24.7713L10.9029 16.0629L4.30071 10.7169C4.01456 10.4852 3.97043 10.0654 4.20213 9.77927C4.43383 9.49313 4.85362 9.44899 5.13977 9.68069L14.3212 17.1152C15.296 17.9089 16.6978 17.9089 17.6726 17.1152L17.6742 17.1139L29.3335 7.6807V7.49878C29.3335 6.26185 28.4013 5.33211 27.3335 5.33211H24.5602C24.192 5.33211 23.8935 5.03364 23.8935 4.66545C23.8935 4.29726 24.192 3.99878 24.5602 3.99878L27.3335 3.99878C29.2123 3.99878 30.6668 5.60238 30.6668 7.49878V7.98699C30.667 7.9946 30.667 8.0022 30.6668 8.0098V24.4988C30.6668 26.3952 29.2123 27.9988 27.3335 27.9988H4.66683C2.78799 27.9988 1.3335 26.3952 1.3335 24.4988L1.3335 7.49878C1.3335 5.60238 2.78799 3.99878 4.66683 3.99878L19.1868 3.99878C19.555 3.99878 19.8535 4.29726 19.8535 4.66545C19.8535 5.03364 19.555 5.33211 19.1868 5.33211H4.66683ZM11.9421 16.9044L3.28968 26.0702C3.65395 26.4427 4.14414 26.6654 4.66683 26.6654H27.3335C27.8562 26.6654 28.3464 26.4427 28.7107 26.0701L25.1686 22.3163C24.9159 22.0485 24.9282 21.6266 25.196 21.3739C25.4637 21.1212 25.8857 21.1335 26.1384 21.4013L29.3182 24.7712C29.3283 24.6823 29.3335 24.5914 29.3335 24.4988V9.39578L21.0953 16.061L24.3784 19.5413C24.631 19.8091 24.6187 20.2311 24.3509 20.4837C24.0831 20.7364 23.6612 20.7241 23.4085 20.4562L20.0558 16.9021L18.5145 18.1491L18.5138 18.1497C17.0489 19.3418 14.9449 19.3418 13.48 18.1497L13.4793 18.1491L11.9421 16.9044Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="1.3335"
          y1="3.99878"
          x2="8.98786"
          y2="30.0293"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const EmailIcon = styled(EmailIconSvg).attrs(
  ({ theme, color = theme.colors.black, size = theme.icons.sizes.standard }) => ({
    color,
    size,
  })
)``

export const BicolorEmailIcon = styled(EmailIconSvg).attrs(
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
