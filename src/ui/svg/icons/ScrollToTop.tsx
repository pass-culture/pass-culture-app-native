import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ScrollToTopSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path d="M4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5L19.5 5C19.7761 5 20 4.77614 20 4.5C20 4.22386 19.7761 4 19.5 4L4.5 4ZM11.6464 6.14645C11.8417 5.95118 12.1583 5.95118 12.3536 6.14645L17.3536 11.1464C17.5488 11.3417 17.5488 11.6583 17.3536 11.8536C17.1583 12.0488 16.8417 12.0488 16.6464 11.8536L12.499 7.70613L12.499 19.5657C12.499 19.8059 12.2752 20.0007 11.999 20.0007C11.7229 20.0007 11.499 19.8059 11.499 19.5657L11.499 7.70808L7.35355 11.8536C7.15829 12.0488 6.84171 12.0488 6.64645 11.8536C6.45118 11.6583 6.45118 11.3417 6.64645 11.1464L11.6464 6.14645Z" />
  </AccessibleSvg>
)

export const ScrollToTop = styled(ScrollToTopSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
