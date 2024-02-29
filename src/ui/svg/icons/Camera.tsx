import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const CameraSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.24 14.0002H40C42.21 14.0002 44 15.7902 44 18.0002V36.0002C44 38.2102 42.21 40.0002 40 40.0002H8C5.79 40.0002 4 38.2102 4 36.0002V18.0002C4 15.7902 5.79 14.0002 8 14.0002H12.76C13.52 14.0002 14.21 13.5702 14.55 12.8902L15.89 10.2102C16.57 8.86024 17.95 8.00024 19.47 8.00024H28.53C30.05 8.00024 31.43 8.85024 32.11 10.2102L33.45 12.8902C33.79 13.5702 34.48 14.0002 35.24 14.0002ZM33.999 25.9998C33.999 31.5226 29.5219 35.9998 23.999 35.9998C18.4762 35.9998 13.999 31.5226 13.999 25.9998C13.999 20.4769 18.4762 15.9998 23.999 15.9998C29.5219 15.9998 33.999 20.4769 33.999 25.9998Z"
      fill={color}
    />
    <Path
      d="M24 32C27.3137 32 30 29.3137 30 26C30 22.6863 27.3137 20 24 20C20.6863 20 18 22.6863 18 26C18 29.3137 20.6863 32 24 32Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const Camera = styled(CameraSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
