import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function ProfileSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon): JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      fill={color}
      viewBox="0 0 48 48">
      <Path d="M18.189 7.194C19.449 5.262 21.579 4 23.998 4c3.867 0 7 3.235 7 7.238v4.524c0 4.003-3.133 7.238-7 7.238-3.868 0-7-3.235-7-7.238v-4.524c0-1.497.44-2.894 1.191-4.044ZM9.03 36.66c1.743-6.625 7.767-11.524 14.965-11.524 7.198 0 13.232 4.898 14.975 11.524.079.299 0 .618-.21.846a20.004 20.004 0 0 1-3.534 3.047S29.906 44 24.005 44c-5.857 0-11.1-2.516-14.765-6.493a.909.909 0 0 1-.21-.847Z" />
    </AccessibleSvg>
  )
}

export const Profile = styled(ProfileSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
