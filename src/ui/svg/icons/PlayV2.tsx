import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const PlaySvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID = 'PlayV2',
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    fill="none"
    accessibilityLabel={accessibilityLabel}>
    <Path
      d="M33.6689 34.6438L37.2884 32.3684C39.4169 31.0303 40.4812 30.3612 40.8292 29.5175C41.1329 28.7812 41.1155 27.9514 40.7811 27.2285C40.3979 26.4002 39.3064 25.7765 37.1234 24.5291L26.5817 18.5052C24.3357 17.2218 23.2127 16.5801 22.2918 16.6797C21.4885 16.7667 20.7596 17.1897 20.2856 17.844C19.7422 18.5941 19.7422 19.8875 19.7422 22.4743V34.1481C19.7422 36.7349 19.7422 38.0284 20.2856 38.7784C20.7596 39.4327 21.4885 39.8557 22.2918 39.9427C23.2127 40.0424 24.3357 39.4006 26.5817 38.1172L29.9771 36.177"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </AccessibleSvg>
)

export const Play = styled(PlaySvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
