import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const MaintenanceConeSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M106.492 22C109.273 22 111.729 23.693 112.592 26.1766L112.663 26.3914L143.682 128.068C143.756 128.309 143.791 128.552 143.791 128.791H197.218C198.754 128.791 200 129.956 200 131.395C200 132.782 198.842 133.917 197.382 133.996L197.218 134H123.043C121.507 134 120.261 132.834 120.261 131.395C120.261 130.008 121.42 128.874 122.88 128.795L123.043 128.791H138.173L124.276 83.2406L59.3386 111.476L53.9856 128.791H59.9856C61.5098 128.791 62.7451 129.956 62.7451 131.395C62.7451 132.782 61.5961 133.917 60.1477 133.996L59.9856 134H27.5961C26.0719 134 24.8366 132.834 24.8366 131.395C24.8366 130.008 25.9856 128.874 27.434 128.795L27.5961 128.791H48.366C48.366 128.598 48.3882 128.403 48.4366 128.207L48.4771 128.059L79.9085 26.3719C80.6863 23.8545 83.0784 22.1029 85.8301 22.0039L86.0732 22H106.492ZM7.75556 128.791C9.24837 128.791 10.4575 129.956 10.4575 131.395C10.4575 132.782 9.33333 133.917 7.91503 133.996L7.75556 134H2.70196C1.20915 134 0 132.834 0 131.395C0 130.008 1.12418 128.874 2.54248 128.795L2.70196 128.791H7.75556ZM119.241 66.7375L66.2235 89.2013L61.4288 104.712L122.698 78.0716L119.241 66.7375ZM113.586 48.2028L73.1124 66.9133L68.2275 82.7157L117.718 61.747L113.586 48.2028ZM106.492 27.2093H86.0732C85.702 27.2093 85.3725 27.419 85.2301 27.7354L85.1922 27.8331L75.2379 60.0357L112.01 43.0365L107.374 27.837C107.269 27.4984 106.963 27.2562 106.603 27.2158L106.492 27.2093Z"
      />
    </AccessibleSvg>
  )
}

export const MaintenanceCone = styled(MaintenanceConeSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.illustrations.sizes.medium,
}))``
