import * as React from 'react'
import { Circle, Path } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ValidateSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, white },
  } = useTheme()
  const fillColor = color === white ? primary : white
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel ?? `Sélectionné`}
      testID={testID}>
      <Circle r={10} cx={24} cy={24} fill={fillColor} />
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM34.5064 19.0406C35.1603 18.3496 35.1651 17.2239 34.5173 16.5265C33.8694 15.829 32.8141 15.8239 32.1603 16.5149L21.1214 28.1818L15.8395 22.6019C15.1855 21.911 14.1302 21.9165 13.4825 22.6141C12.8348 23.3117 12.8399 24.4373 13.4939 25.1282L19.2034 31.1598C20.2638 32.2801 21.9792 32.2801 23.0396 31.1598L23.0399 31.1596L34.5064 19.0406Z"
      />
    </AccessibleSvg>
  )
}

export const Validate = styled(ValidateSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
