import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const NotMemoizedSignal: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID = 'BicolorSignal',
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={color}
        d="M40 4C37.7877 4 36 5.78772 36 8V40C36 42.2123 37.7877 44 40 44C42.2123 44 44 42.2123 44 40V16C44 15.4477 43.5523 15 43 15C42.4477 15 42 15.4477 42 16V40C42 41.1077 41.1077 42 40 42C38.8923 42 38 41.1077 38 40V8C38 6.89228 38.8923 6 40 6C41.1077 6 42 6.89228 42 8V10.68C42 11.2323 42.4477 11.68 43 11.68C43.5523 11.68 44 11.2323 44 10.68V8C44 5.78772 42.2123 4 40 4ZM25 19C25 16.7877 26.7877 15 29 15C31.2123 15 33 16.7877 33 19V40C33 42.2123 31.2123 44 29 44C26.7877 44 25 42.2123 25 40C25 39.4477 25.4477 39 26 39C26.5523 39 27 39.4477 27 40C27 41.1077 27.8923 42 29 42C30.1077 42 31 41.1077 31 40V19C31 17.8923 30.1077 17 29 17C27.8923 17 27 17.8923 27 19V35C27 35.5523 26.5523 36 26 36C25.4477 36 25 35.5523 25 35V19ZM18 26C15.7877 26 14 27.7877 14 30V40C14 42.2123 15.7877 44 18 44C20.2123 44 22 42.2123 22 40V30C22 29.4477 21.5523 29 21 29C20.4477 29 20 29.4477 20 30V40C20 41.1077 19.1077 42 18 42C16.8923 42 16 41.1077 16 40V30C16 28.8923 16.8923 28 18 28C18.5523 28 19 27.5523 19 27C19 26.4477 18.5523 26 18 26ZM8 36C5.78772 36 4 37.7877 4 40C4 42.2123 5.78772 44 8 44C10.2123 44 12 42.2123 12 40C12 37.7877 10.2123 36 8 36ZM6 40C6 38.8923 6.89228 38 8 38C9.10772 38 10 38.8923 10 40C10 41.1077 9.10772 42 8 42C6.89228 42 6 41.1077 6 40Z"
      />
    </AccessibleSvg>
  )
}

export const Signal = React.memo(
  styled(NotMemoizedSignal).attrs(({ color, size, theme }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
