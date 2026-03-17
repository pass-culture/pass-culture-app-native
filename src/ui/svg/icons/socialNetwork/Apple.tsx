import React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const AppleSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <G transform="translate(2.25, 0) scale(1.5)">
      <Path
        d="M12.5864 5.4544C12.4937 5.5264 10.8584 6.4496 10.8584 8.5024C10.8584 10.8768 12.9393 11.7168 13.0016 11.7376C12.992 11.7888 12.671 12.888 11.9044 14.008C11.2209 14.9936 10.507 15.9776 9.42101 15.9776C8.33501 15.9776 8.05553 15.3456 6.80184 15.3456C5.5801 15.3456 5.1457 15.9984 4.15233 15.9984C3.15897 15.9984 2.46585 15.0864 1.66892 13.9664C0.745823 12.6512 0 10.608 0 8.6688C0 5.5584 2.01867 3.9088 4.00541 3.9088C5.06106 3.9088 5.94103 4.6032 6.60381 4.6032C7.23464 4.6032 8.21843 3.8672 9.41941 3.8672C9.87457 3.8672 11.5099 3.9088 12.5864 5.4544ZM8.84926 2.5504C9.34595 1.96 9.6973 1.1408 9.6973 0.3216C9.6973 0.208 9.68771 0.0928 9.66695 0C8.85884 0.0304 7.89742 0.5392 7.31769 1.2128C6.86253 1.7312 6.43771 2.5504 6.43771 3.3808C6.43771 3.5056 6.45848 3.6304 6.46806 3.6704C6.51916 3.68 6.60221 3.6912 6.68526 3.6912C7.41032 3.6912 8.32224 3.2048 8.84926 2.5504Z"
        fill={color}
      />
    </G>
  </AccessibleSvg>
)

export const Apple = styled(AppleSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
