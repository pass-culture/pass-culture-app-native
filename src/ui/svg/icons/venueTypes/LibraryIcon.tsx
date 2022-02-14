import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

function LibrarySvg({ size, color, accessibilityLabel, testID }: AccessibleIcon): JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      fill={color}
      viewBox="0 0 96 96"
      accessibilityLabel={accessibilityLabel}
      aria-hidden={!accessibilityLabel}>
      <Path d="M24 8C19.5846 8 16 11.5846 16 16V78.6742C16.9094 78.2419 17.9266 78 19 78H28V66C28 64.8954 28.8954 64 30 64C31.1046 64 32 64.8954 32 66V78H76C78.2154 78 80 76.2154 80 74V26C80 24.8954 80.8954 24 82 24C83.1046 24 84 24.8954 84 26V74C84 78.4246 80.4246 82 76 82H30H19C17.3446 82 16 83.3446 16 85C16 86.6554 17.3446 88 19 88V90C19 88 19.0019 88 19.0023 88H72C72.8608 88 73.3911 87.8538 73.6561 87.6807C73.7592 87.6133 73.8213 87.5434 73.8695 87.4477C73.9223 87.3426 74 87.1207 74 86.7C74 85.5954 74.8954 84.7 76 84.7C77.1046 84.7 78 85.5954 78 86.7C78 88.6215 77.2335 90.1215 75.8439 91.0293C74.6089 91.8362 73.1392 92 72 92H19C15.8576 92 13.1972 89.9269 12.3127 87.0743C12.1147 86.764 12 86.3954 12 86V85V16C12 9.37543 17.3754 4 24 4H30H78C81.3046 4 84 6.69543 84 10V15.32C84 16.4246 83.1046 17.32 82 17.32C80.8954 17.32 80 16.4246 80 15.32V10C80 8.90457 79.0954 8 78 8H32V56C32 57.1046 31.1046 58 30 58C28.8954 58 28 57.1046 28 56V8H24ZM42 30C42 28.8954 42.8954 28 44 28H68C69.1046 28 70 28.8954 70 30C70 31.1046 69.1046 32 68 32H44C42.8954 32 42 31.1046 42 30ZM44 38C42.8954 38 42 38.8954 42 40C42 41.1046 42.8954 42 44 42H60C61.1046 42 62 41.1046 62 40C62 38.8954 61.1046 38 60 38H44Z" />
    </AccessibleSvg>
  )
}

export const LibraryIcon = styled(LibrarySvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
