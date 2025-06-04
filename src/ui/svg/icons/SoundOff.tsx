import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function SoundOffSvg({
  size,
  color,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element {
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
        d="M27.81,40.94c-.39,0-.78-.11-1.12-.33l-6.49-4.17c-.46-.3-.6-.92-.3-1.38.3-.46.92-.6,1.38-.3l6.49,4.17.11-.07V9.15l-.65-.92.54.84-15.26,9.8c-.16.1-.35.16-.54.16h-4.83c-.63,0-1.15.53-1.15,1.17v7.6c0,.65.51,1.17,1.15,1.17h4.83c.19,0,.38.05.54.16l4.62,2.96c.46.3.6.92.3,1.38-.3.46-.92.6-1.38.3l-4.37-2.81h-4.54c-1.74,0-3.15-1.42-3.15-3.17v-7.6c0-1.75,1.41-3.17,3.15-3.17h4.54l15.01-9.64c.63-.41,1.44-.44,2.11-.07.67.37,1.08,1.07,1.08,1.83v29.71c0,.76-.42,1.47-1.08,1.83-.31.17-.65.25-.99.25Z"
      />
      <Path d="M39.41,24l4.29-4.29c.39-.39.39-1.02,0-1.41s-1.02-.39-1.41,0l-4.29,4.29-4.29-4.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l4.29,4.29-4.29,4.29c-.39.39-.39,1.02,0,1.41.2.2.45.29.71.29s.51-.1.71-.29l4.29-4.29,4.29,4.29c.2.2.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.02,0-1.41l-4.29-4.29Z" />
    </AccessibleSvg>
  )
}

export const SoundOff = styled(SoundOffSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
