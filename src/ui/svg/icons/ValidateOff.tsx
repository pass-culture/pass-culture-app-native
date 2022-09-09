import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ValidateOffSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel ?? `Non sélectionné`}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 41.604C33.7224 41.604 41.604 33.7224 41.604 24C41.604 14.2776 33.7224 6.39597 24 6.39597C14.2776 6.39597 6.39597 14.2776 6.39597 24C6.39597 33.7224 14.2776 41.604 24 41.604ZM24 44.004C35.0479 44.004 44.004 35.0479 44.004 24C44.004 12.9521 35.0479 3.99597 24 3.99597C12.9521 3.99597 3.99597 12.9521 3.99597 24C3.99597 35.0479 12.9521 44.004 24 44.004Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const ValidateOff = styled(ValidateOffSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
