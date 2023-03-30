import * as React from 'react'
import { Path, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const TryAgainSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Rect width="16" height="16" rx="8" fill={theme.colors.white} />
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667ZM10.3151 4.58969C10.4391 4.93637 10.2585 5.31793 9.91183 5.4419L9.5537 5.56998C9.92805 5.76759 10.2601 6.03423 10.5327 6.35259C11.0312 6.93495 11.333 7.69282 11.333 8.51948C11.333 10.3604 9.84062 11.8528 7.99967 11.8528C6.15872 11.8528 4.66634 10.3604 4.66634 8.51948C4.66634 8.1118 4.73983 7.71977 4.87487 7.35691C5.0033 7.01185 5.38714 6.83622 5.7322 6.96464C6.07727 7.09306 6.2529 7.4769 6.12447 7.82197C6.04398 8.03826 5.99967 8.27294 5.99967 8.51948C5.99967 9.62405 6.8951 10.5195 7.99967 10.5195C9.10424 10.5195 9.99967 9.62405 9.99967 8.51948C9.99967 8.02265 9.81938 7.56963 9.5198 7.21971C9.34035 7.01009 9.11891 6.83834 8.86856 6.7174L9.14921 7.30047C9.3089 7.63223 9.16941 8.03062 8.83765 8.19031C8.50589 8.35 8.1075 8.21051 7.94781 7.87875L6.97532 5.85834C6.89335 5.68805 6.88751 5.49097 6.95926 5.31613C7.031 5.14129 7.17358 5.00511 7.35153 4.94147L9.46286 4.18644C9.80955 4.06246 10.1911 4.243 10.3151 4.58969Z"
    />
  </AccessibleSvg>
)

export const TryAgain = styled(TryAgainSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.error,
  size: size ?? theme.icons.sizes.standard,
}))``
