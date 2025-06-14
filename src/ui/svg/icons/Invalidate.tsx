import React from 'react'
import { Circle, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const InvalidateSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
  backgroundColor,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      fill={color}>
      {backgroundColor ? <Circle r={10} cx={24} cy={24} fill={backgroundColor} /> : null}
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM15.5872 15.5844C16.369 14.8041 17.6353 14.8054 18.4156 15.5872L23.9882 21.1706L29.5524 15.6192C30.3343 14.839 31.6007 14.8405 32.3808 15.6224C33.161 16.4044 33.1595 17.6707 32.3776 18.4509L26.8214 23.9943L32.4095 29.5462C33.1931 30.3247 33.1972 31.5911 32.4187 32.3746C31.6402 33.1582 30.3739 33.1623 29.5903 32.3838L23.9999 26.8296L18.4578 32.4094C17.6794 33.1931 16.4131 33.1974 15.6294 32.419C14.8457 31.6406 14.8414 30.3743 15.6198 29.5906L21.1667 24.006L15.5844 18.4128C14.8041 17.631 14.8054 16.3647 15.5872 15.5844Z"
      />
    </AccessibleSvg>
  )
}

export const Invalidate = styled(InvalidateSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
