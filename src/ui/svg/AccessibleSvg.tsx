import React from 'react'
import Svg, { SvgProps } from 'react-native-svg'

export const AccessibleSvg: React.FunctionComponent<SvgProps> = ({
  children,
  accessibilityLabel,
  ...props
}) => (
  <Svg accessibilityLabel={accessibilityLabel} accessibilityRole="image" {...props}>
    {children}
  </Svg>
)
