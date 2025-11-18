import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const InvalidateSvg: React.FC<AccessibleIcon> = ({ size, color, accessibilityLabel, testID }) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fill={color}
        d="M11.9998 1.99969C17.5225 1.99969 21.9996 6.477 21.9998 11.9997C21.9998 17.5225 17.5226 21.9997 11.9998 21.9997C6.47706 21.9995 1.99976 17.5224 1.99976 11.9997C1.99993 6.47711 6.47717 1.99987 11.9998 1.99969ZM9.20776 7.79364C8.81768 7.40319 8.18451 7.40195 7.7937 7.79169C7.40298 8.18165 7.40215 8.8148 7.79175 9.20575L10.5828 12.0026L7.80933 14.7946C7.42034 15.1862 7.423 15.8194 7.81421 16.2087C8.20606 16.5979 8.83907 16.5956 9.22827 16.2038L11.9988 13.4138L14.7947 16.1911C15.1864 16.5803 15.8195 16.5788 16.2087 16.1872C16.598 15.7954 16.5956 15.1624 16.2039 14.7731L13.4099 11.9968L16.1882 9.22528C16.5791 8.8353 16.58 8.20221 16.1902 7.81122C15.8001 7.42067 15.167 7.4195 14.7761 7.80927L11.9929 10.5847L9.20776 7.79364Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const Invalidate = styled(InvalidateSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
