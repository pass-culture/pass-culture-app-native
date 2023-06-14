import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function ClearSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon): React.JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      viewBox="0 0 48 48"
      fill={color}>
      <Path d="M24 45C35.598 45 45 35.598 45 24C45 12.402 35.598 3 24 3C12.402 3 3 12.402 3 24C3 35.598 12.402 45 24 45ZM15.5872 15.5844C16.369 14.8041 17.6353 14.8054 18.4156 15.5872L23.9882 21.1706L29.5524 15.6192C30.3343 14.839 31.6007 14.8405 32.3808 15.6224C33.161 16.4044 33.1595 17.6707 32.3776 18.4509L26.8214 23.9943L32.4095 29.5462C33.1931 30.3247 33.1972 31.5911 32.4187 32.3746C31.6402 33.1582 30.3739 33.1623 29.5903 32.3838L23.9999 26.8296L18.4578 32.4094C17.6794 33.1931 16.4131 33.1974 15.6294 32.419C14.8457 31.6406 14.8414 30.3743 15.6198 29.5906L21.1667 24.006L15.5844 18.4128C14.8041 17.631 14.8054 16.3647 15.5872 15.5844Z" />
    </AccessibleSvg>
  )
}

export const Clear = styled(ClearSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
