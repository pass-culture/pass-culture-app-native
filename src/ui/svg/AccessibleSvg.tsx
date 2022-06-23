import React from 'react'
// eslint-disable-next-line no-restricted-imports
import Svg, { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

export const AccessibleSvg: React.FunctionComponent<SvgProps> = ({
  children,
  accessibilityLabel,
  ...props
}) => {
  const { accessibilityRole } = useTheme()
  return (
    <Svg
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? accessibilityRole.image : undefined}
      aria-hidden={!accessibilityLabel}
      {...props}>
      {children}
    </Svg>
  )
}
