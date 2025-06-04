import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function PauseSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon): React.JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      fill={color}
      accessibilityLabel={accessibilityLabel}
      viewBox="0 0 48 48">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15,6c-.55,0-1,.45-1,1v34c0,.55.45,1,1,1s1-.45,1-1V7c0-.55-.45-1-1-1Z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33,6c-.55,0-1,.45-1,1v34c0,.55.45,1,1,1s1-.45,1-1V7c0-.55-.45-1-1-1Z"
      />
    </AccessibleSvg>
  )
}

export const Pause = styled(PauseSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
