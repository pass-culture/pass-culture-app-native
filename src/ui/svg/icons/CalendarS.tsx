import * as React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function CalendarSSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon) {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G fill="none" fillRule="evenodd">
        <G fill={color}>
          <Path
            d="M8 2.5C7.17157 2.5 6.5 3.17157 6.5 4V6.5C5.01944 6.5 3.72675 7.3044 3.03513 8.5H2.5V10.5V11.5V17.5C2.5 19.7091 4.29086 21.5 6.5 21.5H17.5C19.7091 21.5 21.5 19.7091 21.5 17.5V11.5V10.5V8.5H20.9649C20.2733 7.3044 18.9806 6.5 17.5 6.5L17.5 4C17.5 3.17157 16.8284 2.5 16 2.5C15.1716 2.5 14.5 3.17157 14.5 4V6.5H9.5V4C9.5 3.17157 8.82843 2.5 8 2.5ZM6 11C6 10.4477 6.44772 10 7 10C7.55228 10 8 10.4477 8 11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11ZM20.5 15H19C16.7909 15 15 16.7909 15 19V20.5L17.75 17.75L20.5 15ZM12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10ZM15.5 11C15.5 10.4477 15.9477 10 16.5 10C17.0523 10 17.5 10.4477 17.5 11C17.5 11.5523 17.0523 12 16.5 12C15.9477 12 15.5 11.5523 15.5 11ZM7 14C6.44772 14 6 14.4477 6 15C6 15.5523 6.44772 16 7 16C7.55228 16 8 15.5523 8 15C8 14.4477 7.55228 14 7 14ZM11 15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15Z"
            transform="translate(-146 -1065) translate(134 1061) translate(12 4)"
          />
        </G>
      </G>
    </AccessibleSvg>
  )
}

export const CalendarS = styled(CalendarSSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
