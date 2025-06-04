import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function SoundOnSvg({
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
        d="M27.81,40.94c-.39,0-.78-.11-1.12-.33l-6.49-4.17c-.46-.3-.6-.92-.3-1.38.3-.47.92-.6,1.38-.3l6.49,4.17.11-.07V9.15l-.65-.92.54.84-15.26,9.8c-.16.1-.35.16-.54.16h-4.83c-.63,0-1.15.53-1.15,1.17v7.6c0,.65.51,1.17,1.15,1.17h4.83c.19,0,.38.05.54.16l4.62,2.96c.46.3.6.92.3,1.38-.3.47-.92.6-1.38.3l-4.37-2.81h-4.54c-1.74,0-3.15-1.42-3.15-3.17v-7.6c0-1.75,1.41-3.17,3.15-3.17h4.54l15.01-9.64c.63-.41,1.44-.44,2.11-.07.67.37,1.08,1.07,1.08,1.83v29.71c0,.76-.42,1.47-1.08,1.83-.31.17-.65.25-.99.25Z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.81,36.15c-.47,0-.89-.33-.98-.81-.11-.54.25-1.07.79-1.17,4.86-.96,8.38-5.25,8.38-10.2s-3.4-9.08-8.09-10.14c-.54-.12-.88-.66-.76-1.19.12-.54.66-.88,1.19-.76,5.6,1.25,9.66,6.34,9.66,12.09s-4.2,11.02-9.99,12.16c-.07.01-.13.02-.19.02Z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.69,30.1c-.43,0-.83-.28-.96-.71-.16-.53.14-1.09.67-1.24,1.82-.54,3.08-2.24,3.08-4.14s-1.27-3.6-3.08-4.14c-.53-.16-.83-.71-.67-1.24.16-.53.71-.83,1.24-.67,2.66.79,4.51,3.28,4.51,6.05s-1.86,5.26-4.51,6.05c-.09.03-.19.04-.29.04Z"
      />
    </AccessibleSvg>
  )
}

export const SoundOn = styled(SoundOnSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
