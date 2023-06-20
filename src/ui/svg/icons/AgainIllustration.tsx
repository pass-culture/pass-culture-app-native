import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const AgainIllustrationSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        d="M131.886 17.527C133.314 16.708 133.807 14.886 132.989 13.4575C132.171 12.029 130.35 11.5348 128.923 12.3538L109.366 23.5745C108.674 23.9714 108.17 24.6293 107.967 25.401C107.764 26.1727 107.878 26.9937 108.285 27.6804L120.133 47.7026C120.972 49.1194 122.799 49.5878 124.215 48.7487C125.63 47.9096 126.098 46.0808 125.26 44.664L117.04 30.7739C127.158 34.2319 135.941 40.7859 142.086 49.5303C148.916 59.25 152.046 71.0478 150.92 82.832C149.794 94.6162 144.485 105.625 135.935 113.907C127.384 122.189 116.145 127.209 104.21 128.076C92.2742 128.943 80.4138 125.602 70.7315 118.645C61.0493 111.688 54.1707 101.565 51.3154 90.0697C48.4602 78.5748 49.8128 66.4512 55.1334 55.8487C60.0081 46.1347 67.925 38.2725 77.6644 33.4071C79.1402 32.6698 79.8454 30.922 79.1876 29.4188C78.5384 27.9352 76.8048 27.2489 75.3431 27.9661C64.2907 33.3889 55.3053 42.2507 49.7963 53.2287C43.8498 65.0786 42.338 78.6284 45.5292 91.4757C48.7203 104.323 56.4081 115.637 67.2295 123.413C78.0509 131.188 91.3066 134.923 104.646 133.953C117.986 132.984 130.547 127.374 140.104 118.118C149.66 108.861 155.593 96.5571 156.852 83.3865C158.11 70.216 154.613 57.0301 146.979 46.167C140.05 36.3069 130.12 28.9387 118.684 25.1017L131.886 17.527Z"
      />
    </AccessibleSvg>
  )
}

export const AgainIllustration = styled(AgainIllustrationSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.illustrations.sizes.medium,
}))``
