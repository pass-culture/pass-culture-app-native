import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const SadFaceSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        d="M100 18C133.137 18 160 44.8629 160 78C160 91.3909 155.594 104.123 147.605 114.525C146.542 115.907 144.559 116.167 143.176 115.105C141.793 114.042 141.534 112.059 142.595 110.677C149.746 101.37 153.685 89.9874 153.685 78C153.685 48.3509 129.649 24.3154 100 24.3154C70.3486 24.3154 46.3154 48.3497 46.3154 78C46.3154 107.65 70.3486 131.685 100 131.685C107.271 131.685 114.341 130.238 120.894 127.467C122.501 126.789 124.353 127.541 125.032 129.147C125.712 130.753 124.96 132.606 123.353 133.285C116.025 136.382 108.119 138 100 138C66.8606 138 40 111.138 40 78C40 44.8617 66.8606 18 100 18ZM126 90.7829C127.366 91.9566 127.561 94.0503 126.434 95.4571C125.309 96.8651 123.288 97.0537 121.92 95.88C114.983 89.92 105.878 86.896 96.4457 87.6457C89.6137 88.1897 83.2389 90.6617 77.9531 94.7063C76.5326 95.7931 74.5246 95.4777 73.4651 94.0011C72.4069 92.5246 72.6994 90.4469 74.12 89.3611C80.3646 84.5817 87.8823 81.6663 95.9166 81.0274C107.016 80.144 117.776 83.7166 125.999 90.7829H126ZM82.8571 66C85.0686 66 86.8571 67.792 86.8571 70C86.8571 72.2114 85.0686 74 82.8571 74C80.6491 74 78.8571 72.2114 78.8571 70C78.8571 67.792 80.6491 66 82.8571 66ZM116 66C118.208 66 120 67.792 120 70C120 72.2114 118.208 74 116 74C113.787 74 112 72.2114 112 70C112 67.792 113.787 66 116 66Z"
      />
    </AccessibleSvg>
  )
}

export const SadFace = styled(SadFaceSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.illustrations.sizes.medium,
}))``
