import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const LocationPointerSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 49"
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    aria-hidden={!accessibilityLabel}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.0857 23.3176C13.2294 23.64 13.3804 23.9789 13.5343 24.3553C14.34 26.344 22.5171 41.6449 22.5171 41.6449C23.1771 42.785 24.8229 42.785 25.4829 41.6449C25.4829 41.6449 33.7971 25.924 34.4657 24.3553C34.5876 24.0695 34.716 23.7984 34.8445 23.527C35.4211 22.3096 36 21.0874 36 18.5007C36 11.7655 30.6257 6.5 24 6.5C17.3743 6.5 12 11.7249 12 18.5007C12 20.882 12.4769 21.9518 13.0857 23.3176ZM24 23.6438C26.8404 23.6438 29.1429 21.3412 29.1429 18.5007C29.1429 15.6602 26.8404 13.3575 24 13.3575C21.1597 13.3575 18.8572 15.6602 18.8572 18.5007C18.8572 21.3412 21.1597 23.6438 24 23.6438Z"
    />
  </AccessibleSvg>
)

export const LocationPointer = styled(LocationPointerSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
