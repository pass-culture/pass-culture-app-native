import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const HappyFaceWithTearSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        d="M96.6367 18.0748C134.769 16.2218 164.923 49.0803 159.33 86.9885C158.006 95.9573 154.268 105.355 148.957 112.685C147.562 114.61 145.82 117.089 143.159 115.068C140.005 112.674 144.025 108.906 145.453 106.647C164.759 76.0825 148.686 35.3522 113.994 26.116C75.0024 15.7343 39.0292 50.0817 47.5088 89.488C54.0486 119.879 85.4517 138.386 115.389 129.476C117.046 128.983 120.001 127.533 121.408 127.312C124.477 126.83 126.474 130.093 124.548 132.411C123.276 133.943 115.239 136.077 113.025 136.561C71.0792 145.731 33.5999 109.703 40.9205 67.4559C45.6129 40.3811 69.0888 19.4127 96.6367 18.0748Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <Path
        d="M94.4709 98.2448C94.8561 97.9993 93.8297 91.311 93.5495 91.447C102.016 92.8609 110.789 91.2476 118.085 86.7695C119.268 86.0435 121.675 83.9497 122.813 83.778C125.864 83.317 127.712 86.7119 125.864 89.1319C125.398 89.7426 124.414 90.3811 123.777 90.8489C115.52 96.9138 104.63 99.4778 94.4709 98.2459V98.2448Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <Path
        d="M82.4522 80.511C82.8546 80.4177 83.2214 81.2163 83.3909 81.494C84.9973 84.1456 87.3106 89.5387 88.4984 92.5198C89.2688 94.4547 89.6863 96.0495 89.3691 98.1549C87.938 107.652 74.3855 106.149 75.6044 95.4526C75.8708 93.1144 78.6108 87.5082 79.7375 85.1804C80.0731 84.4855 81.9171 80.6332 82.4533 80.5099L82.4522 80.511Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <Path
        d="M82.8558 73.9645C85.0544 73.9645 86.8367 72.1824 86.8367 69.9842C86.8367 67.7859 85.0544 66.0039 82.8558 66.0039C80.6572 66.0039 78.8749 67.7859 78.8749 69.9842C78.8749 72.1824 80.6572 73.9645 82.8558 73.9645Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <Path
        d="M115.999 73.9656C118.198 73.9656 119.98 72.1836 119.98 69.9853C119.98 67.7871 118.198 66.0051 115.999 66.0051C113.8 66.0051 112.018 67.7871 112.018 69.9853C112.018 72.1836 113.8 73.9656 115.999 73.9656Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const HappyFaceWithTear = styled(HappyFaceWithTearSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.illustrations.sizes.medium,
}))``
