import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const MoreFullSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10 1.66699C14.6024 1.66699 18.333 5.39763 18.333 10C18.333 14.6024 14.6024 18.333 10 18.333C5.39763 18.333 1.66699 14.6024 1.66699 10C1.66699 5.39763 5.39763 1.66699 10 1.66699ZM10.001 5.45898C9.54104 5.45873 9.16669 5.83109 9.16602 6.29102L9.16406 9.16699L6.30078 9.17871C5.84057 9.18027 5.4682 9.55444 5.46973 10.0146C5.47152 10.4745 5.84582 10.846 6.30566 10.8447L9.16602 10.834L9.17676 13.7012C9.17861 14.161 9.55285 14.5325 10.0127 14.5312C10.4728 14.5297 10.8451 14.1554 10.8438 13.6953L10.833 10.8291L13.6865 10.833C14.1463 10.8334 14.5195 10.4617 14.5205 10.002C14.521 9.54183 14.1486 9.16771 13.6885 9.16699L10.8301 9.16211L10.833 6.29297C10.8335 5.83291 10.461 5.45972 10.001 5.45898Z"
    />
  </AccessibleSvg>
)

export const MoreFull = styled(MoreFullSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.brandPrimary,
  size: size ?? theme.icons.sizes.small,
}))``
