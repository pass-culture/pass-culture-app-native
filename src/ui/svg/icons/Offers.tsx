import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

function OffersSvg({ size, testID, accessibilityLabel, color }: AccessibleIcon) {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 20 20">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.25954 3.33268C8.25954 2.87389 8.6326 2.49935 9.10191 2.49935H16.6568C17.1261 2.49935 17.4991 2.87389 17.4991 3.33268V4.41185C17.4991 4.64197 17.6857 4.82852 17.9159 4.82852C18.1461 4.82852 18.3327 4.64197 18.3327 4.41185V3.33268C18.3327 2.40814 17.5809 1.66602 16.6568 1.66602H9.10191C8.17777 1.66602 7.42599 2.40814 7.42599 3.33268V16.666C7.42599 17.5906 8.17777 18.3327 9.10191 18.3327H16.6568C17.5809 18.3327 18.3327 17.5906 18.3327 16.666V7.32852C18.3327 7.0984 18.1461 6.91185 17.9159 6.91185C17.6857 6.91185 17.4991 7.0984 17.4991 7.32852V16.666C17.4991 17.1248 17.1261 17.4993 16.6568 17.4993H9.10191C8.6326 17.4993 8.25954 17.1248 8.25954 16.666V3.33268ZM5.79523 3.52325C6.0179 3.46495 6.15114 3.23723 6.09282 3.01462C6.03451 2.79201 5.80672 2.65881 5.58405 2.71711L2.91069 3.41705C2.01569 3.65042 1.48299 4.56757 1.72397 5.4582L4.94731 17.3913C5.00732 17.6135 5.23611 17.7449 5.45833 17.6849C5.68055 17.6249 5.81205 17.3962 5.75204 17.174L2.52857 5.24049C2.40877 4.79794 2.67333 4.34008 3.12119 4.22337L5.79523 3.52325Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const Offers = styled(OffersSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
