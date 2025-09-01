import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const CloseFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      d="M24.826 21.0171C26.4634 22.6578 26.4614 25.3146 24.8224 26.961L24.818 26.9654L13.7 38.1682C12.6493 39.226 10.9422 39.234 9.88698 38.186C8.83179 37.1379 8.82858 35.4303 9.87929 34.3725L20.1731 23.9986L9.83404 13.6365C8.78344 12.5838 8.78726 10.8767 9.84257 9.82339C10.8978 8.77017 12.605 8.76973 13.6556 9.82228L24.826 21.0171Z"
      fill={color}
    />
    <Path
      d="M38.1199 13.6727L27.7953 23.9703L38.1584 34.2563C39.213 35.3045 39.2163 37.0114 38.1655 38.0689C37.1147 39.1266 35.4072 39.134 34.3521 38.0858L23.1573 26.9727L23.1528 26.9683C21.4956 25.3257 21.4995 22.6511 23.1437 21.0037L23.1475 20.9999L23.1495 20.9979L34.316 9.86004C35.3715 8.80696 37.0787 8.80675 38.1291 9.85958C39.1795 10.9124 39.1753 12.6196 38.1199 13.6727Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const CloseFilled = styled(CloseFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
