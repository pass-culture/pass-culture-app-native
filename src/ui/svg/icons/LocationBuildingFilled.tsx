import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const LocationBuildingFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.15 0H23.85C22.28 0 21 1.28 21 2.85V20.57H28.78C33 20.57 36.43 24 36.43 28.22V46.38C36.43 46.95 36.31 47.48 36.14 47.99H42.15C43.72 47.99 45 46.71 45 45.14V2.85C45 1.28 43.72 0 42.15 0ZM27.54 16.72C27.54 17.32 27.05 17.81 26.45 17.81C25.85 17.81 25.36 17.32 25.36 16.72V14.54C25.36 13.94 25.85 13.45 26.45 13.45C27.05 13.45 27.54 13.94 27.54 14.54V16.72ZM27.54 8.99C27.54 9.59 27.05 10.08 26.45 10.08C25.85 10.08 25.36 9.59 25.36 8.99V6.81C25.36 6.21 25.85 5.72 26.45 5.72C27.05 5.72 27.54 6.21 27.54 6.81V8.99ZM34.09 16.72C34.09 17.32 33.6 17.81 33 17.81C32.4 17.81 31.91 17.32 31.91 16.72V14.54C31.91 13.94 32.4 13.45 33 13.45C33.6 13.45 34.09 13.94 34.09 14.54V16.72ZM34.09 8.99C34.09 9.59 33.6 10.08 33 10.08C32.4 10.08 31.91 9.59 31.91 8.99V6.81C31.91 6.21 32.4 5.72 33 5.72C33.6 5.72 34.09 6.21 34.09 6.81V8.99ZM40.64 34.26C40.64 34.86 40.15 35.35 39.55 35.35C38.95 35.35 38.46 34.86 38.46 34.26V32.08C38.46 31.48 38.95 30.99 39.55 30.99C40.15 30.99 40.64 31.48 40.64 32.08V34.26ZM40.64 25.44C40.64 26.04 40.15 26.53 39.55 26.53C38.95 26.53 38.46 26.04 38.46 25.44V23.26C38.46 22.66 38.95 22.17 39.55 22.17C40.15 22.17 40.64 22.66 40.64 23.26V25.44ZM40.64 16.71C40.64 17.31 40.15 17.8 39.55 17.8C38.95 17.8 38.46 17.31 38.46 16.71V14.53C38.46 13.93 38.95 13.44 39.55 13.44C40.15 13.44 40.64 13.93 40.64 14.53V16.71ZM40.64 8.98C40.64 9.58 40.15 10.07 39.55 10.07C38.95 10.07 38.46 9.58 38.46 8.98V6.8C38.46 6.2 38.95 5.71 39.55 5.71C40.15 5.71 40.64 6.2 40.64 6.8V8.98Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.78 24H7.22C4.89 24 3 25.89 3 28.22V46.38C3 47.27 3.72 47.99 4.61 47.99H13.8V37.88C13.8 36.84 14.64 35.99 15.69 35.99H20.32C21.36 35.99 22.21 36.83 22.21 37.88V47.99H31.4C32.29 47.99 33.01 47.27 33.01 46.38V28.22C33.01 25.89 31.12 24 28.79 24H28.78Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const LocationBuildingFilled = styled(LocationBuildingFilledSvg).attrs(
  ({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    size: size ?? theme.icons.sizes.standard,
  })
)``
