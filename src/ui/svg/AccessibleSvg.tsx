import React from 'react'
// eslint-disable-next-line no-restricted-imports
import Svg, { SvgProps } from 'react-native-svg'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const AccessibleSvg: React.FunctionComponent<SvgProps> = ({
  children,
  accessibilityLabel,
  ...props
}) => {
  return (
    <Svg
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? AccessibilityRole.IMAGE : undefined}
      accessibilityHidden={!accessibilityLabel}
      {...props}>
      {children}
    </Svg>
  )
}
