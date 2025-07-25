import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const SmartphoneSvg: React.FunctionComponent<AccessibleIcon & { transform?: string }> = ({
  size,
  color,
  accessibilityLabel,
  testID = 'BicolorSmartphone',
  opacity,
  transform,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        opacity={opacity}
        fill={color}
        transform={transform}
        d="M15 4C13.8923 4 13 4.89228 13 6V10.25C13 10.8023 12.5523 11.25 12 11.25C11.4477 11.25 11 10.8023 11 10.25V6C11 3.78772 12.7877 2 15 2H24H33C35.2123 2 37 3.78772 37 6V40V42C37 44.2123 35.2123 46 33 46H15C12.7877 46 11 44.2123 11 42V16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16V39H25C25.5523 39 26 39.4477 26 40C26 40.5523 25.5523 41 25 41H13V42C13 43.1077 13.8923 44 15 44H33C34.1077 44 35 43.1077 35 42V41H31C30.4477 41 30 40.5523 30 40C30 39.4477 30.4477 39 31 39H35V6C35 4.89228 34.1077 4 33 4H25V6H29C29.5523 6 30 6.44772 30 7C30 7.55228 29.5523 8 29 8H24H19C18.4477 8 18 7.55228 18 7C18 6.44772 18.4477 6 19 6H23V4H15Z"
      />
    </AccessibleSvg>
  )
}

export const Smartphone = styled(SmartphoneSvg).attrs(({ color, size, theme, opacity }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
  opacity: opacity ?? 1,
}))``
