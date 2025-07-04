import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const InfoPlainSvg: React.FunctionComponent<AccessibleIcon> = ({
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
    testID={testID}
    fill={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM26.3858 14.7989C26.3858 16.0686 25.3566 17.0978 24.0869 17.0978C22.8172 17.0978 21.788 16.0686 21.788 14.7989C21.788 13.5293 22.8172 12.5 24.0869 12.5C25.3566 12.5 26.3858 13.5293 26.3858 14.7989ZM21.9964 19.6522L24.1406 19.6522C24.7747 19.6522 25.3277 19.9551 25.6846 20.4026C25.928 20.7001 26.0899 21.0731 26.1238 21.4851C26.1308 21.5546 26.1343 21.6249 26.1343 21.6957C26.1343 21.7388 26.133 21.7818 26.1304 21.8245L26.1304 34.0063C26.1304 35.1549 25.1668 36 24.0869 36C23.007 36 22.0434 35.1549 22.0434 34.0063V23.7391L21.9963 23.7391C20.8478 23.7391 20.0027 22.7755 20.0027 21.6956C20.0027 20.6158 20.8478 19.6522 21.9964 19.6522Z"
    />
  </AccessibleSvg>
)

export const InfoPlain = styled(InfoPlainSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
