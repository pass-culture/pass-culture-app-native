import React from 'react'
import { Platform } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import Svg, { SvgProps } from 'react-native-svg'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

const isWeb = Platform.OS === 'web'

export const AccessibleSvg: React.FC<SvgProps & { accessibilityLabel?: string }> = ({
  children,
  accessibilityLabel,
  ...props
}) => {
  // accessible doesn't work on web, we have to use aria-hidden
  const accessibleProps = isWeb
    ? { 'aria-hidden': !accessibilityLabel }
    : { accessible: !!accessibilityLabel }

  return (
    <Svg
      {...accessibleProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? AccessibilityRole.IMAGE : undefined}
      {...props}>
      {children}
    </Svg>
  )
}
