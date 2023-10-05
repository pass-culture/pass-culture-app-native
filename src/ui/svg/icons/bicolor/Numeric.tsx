import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const NumericSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="18.271%" x2="81.729%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M2.5 5.01C2.5 3.39248 3.70717 2 5.295 2H16.005C16.2811 2 16.505 2.22386 16.505 2.5C16.505 2.77614 16.2811 3 16.005 3H5.295C4.34283 3 3.5 3.85752 3.5 5.01V14.99C3.5 16.1425 4.34283 17 5.295 17H12.4963L12.4999 17L12.5034 17H19.705C20.6528 17 21.5 16.1417 21.5 14.99V5.01C21.5 3.85752 20.6572 3 19.705 3H19.31C19.0339 3 18.81 2.77614 18.81 2.5C18.81 2.22386 19.0339 2 19.31 2H19.705C21.2928 2 22.5 3.39248 22.5 5.01V14.99C22.5 16.6083 21.2872 18 19.705 18H12.9999V21H16.7499C17.026 21 17.2499 21.2238 17.2499 21.5C17.2499 21.7761 17.026 22 16.7499 22H11.2499C10.9737 22 10.7499 21.7761 10.7499 21.5C10.7499 21.2238 10.9737 21 11.2499 21H11.9999V18H5.295C3.70717 18 2.5 16.6075 2.5 14.99V5.01ZM8 21C7.72386 21 7.5 21.2238 7.5 21.5C7.5 21.7761 7.72386 22 8 22H9C9.27614 22 9.5 21.7761 9.5 21.5C9.5 21.2238 9.27614 21 9 21H8ZM15.0037 9.22279L11.7607 7.59377C11.1787 7.29829 10.5001 7.72748 10.5001 8.37V11.635C10.5001 12.2775 11.1786 12.7067 11.7607 12.4113L15.0046 10.7818L15.0046 10.7818L15.0103 10.7789C15.6333 10.4558 15.6489 9.54582 15.0042 9.22303L15.0037 9.22279ZM14.3282 10.0025L11.5001 8.58195V11.423L14.3282 10.0025Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorNumeric = React.memo(
  styled(NumericSvg).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)

export const Numeric = styled(NumericSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
