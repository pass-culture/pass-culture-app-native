import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const MusicSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        <LinearGradient id={gradientId} x1="20.085%" x2="79.915%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M35.6965 2.21695C37.7306 1.42656 40 2.88841 40 5.10101V32.751C40 32.8416 39.988 32.9293 39.9654 33.0128C39.6632 35.6152 37.4105 37.6117 34.7111 37.6117C31.8085 37.6117 29.4224 35.3033 29.4224 32.4155C29.4224 29.5276 31.8085 27.2193 34.7111 27.2193C35.9461 27.2193 37.0876 27.6372 37.9916 28.3398V5.10101C37.9916 4.35709 37.1984 3.78497 36.4264 4.08406L36.4253 4.0845L18.6106 11.0685C18.598 11.0733 18.5885 11.0813 18.5823 11.0901C18.5788 11.0952 18.5776 11.0987 18.5773 11.0999V14.379L33.8092 8.41477C34.3254 8.21262 34.9082 8.46638 35.1108 8.98157C35.3133 9.49675 35.059 10.0783 34.5428 10.2804L18.5773 16.5319V32.751C18.5773 33.3044 18.1277 33.7531 17.5731 33.7531C17.0185 33.7531 16.5689 33.3044 16.5689 32.751V11.0987C16.5689 10.2552 17.101 9.50387 17.8827 9.20058L17.8853 9.19954L35.6937 2.21805L35.6965 2.21695ZM31.4307 32.4155C31.4307 30.6706 32.8811 29.2234 34.7111 29.2234C36.541 29.2234 37.9914 30.6706 37.9914 32.4155C37.9914 34.1604 36.541 35.6076 34.7111 35.6076C32.8811 35.6076 31.4307 34.1604 31.4307 32.4155ZM10.0084 40.8038C10.0084 39.0589 11.4588 37.6117 13.2887 37.6117C15.1187 37.6117 16.5691 39.0589 16.5691 40.8038C16.5691 42.5487 15.1187 43.9959 13.2887 43.9959C11.4588 43.9959 10.0084 42.5487 10.0084 40.8038ZM13.2887 35.6076C10.3861 35.6076 8 37.9159 8 40.8038C8 43.6916 10.3861 46 13.2887 46C16.1913 46 18.5774 43.6916 18.5774 40.8038C18.5774 37.9159 16.1913 35.6076 13.2887 35.6076Z"
      />
    </AccessibleSvg>
  )
}

export const Music = styled(MusicSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
