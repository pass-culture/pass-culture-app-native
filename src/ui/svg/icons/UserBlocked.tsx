import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleBicolorIconInterface, AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const UserBlockedSvg: React.FunctionComponent<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="16.056%" x2="83.944%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        d="M82.55 19c-11.043 0-19.775 9.4-19.775 20.738v9.908c0 11.312 8.735 20.71 19.775 20.71 11.043 0 19.775-9.4 19.775-20.738v-9.88C102.325 28.4 93.593 19 82.55 19ZM68.425 39.738c0-8.479 6.466-15.07 14.125-15.07s14.125 6.591 14.125 15.07v9.88c0 8.478-6.466 15.069-14.125 15.069-7.661 0-14.125-6.594-14.125-15.04v-9.91ZM82.55 82.776c-16.663 0-30.647 12.448-33.719 29.093 8.35 9.62 20.353 15.637 33.72 15.637h.019c2.786 0 6.763-.009 10.367-.668 1.8-.33 3.37-.799 4.589-1.428.939-.484 1.571-1.011 1.974-1.559v-23.464c0-3.606 2.566-6.625 5.989-7.254v-1.798c0-12.396 9.946-22.48 22.261-22.48s22.261 10.084 22.261 22.48v1.798c3.424.63 5.989 3.649 5.989 7.254v30.239c0 4.058-3.251 7.374-7.317 7.374H132.27c-.12 0-.237-.007-.353-.022a2.754 2.754 0 0 1-.353.022h-24.747c-4.025 0-7.251-3.249-7.316-7.251-1.742.804-3.67 1.322-5.55 1.665-4.155.76-8.6.76-11.328.76h-.073c-15.622 0-29.535-7.279-38.902-18.646a2.84 2.84 0 0 1-.648-1.819c0-.2.02-.4.06-.596 3.036-19.75 19.462-35.005 39.49-35.005 4.294 0 8.437.708 12.306 2 1.48.496 2.28 2.1 1.787 3.586a2.823 2.823 0 0 1-3.573 1.793 33.147 33.147 0 0 0-10.52-1.71Zm61.811 8.56v1.676h-33.222v-1.677c0-9.305 7.456-16.81 16.611-16.81 9.155 0 16.611 7.505 16.611 16.81Zm-37.544 7.345h39.966a2.847 2.847 0 0 0 .806 0h1.094c.906 0 1.667.739 1.667 1.706v30.239c0 .967-.761 1.705-1.667 1.705H132.27c-.12 0-.237.008-.353.022a2.947 2.947 0 0 0-.353-.022h-24.747c-.906 0-1.667-.738-1.667-1.705v-5.934l.001-.051v-.032l-.001-.038v-24.184c0-.968.761-1.706 1.667-1.706Zm26.159 17.325c0 2.917-2.34 5.282-5.226 5.282-2.887 0-5.227-2.365-5.227-5.282 0-2.918 2.34-5.283 5.227-5.283 2.886 0 5.226 2.365 5.226 5.283Z"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

//TODO(marineshaw): Temporary fix until we agree on a new icon standard
export const UserBlocked = ({ color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const theme = useTheme()
  const baseColor = color ?? theme.colors.black

  return (
    <UserBlockedSvg
      color={baseColor}
      color2={baseColor}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      size={size ?? theme.illustrations.sizes.medium}
    />
  )
}

export const BicolorUserBlocked = styled(UserBlockedSvg).attrs(
  ({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.secondary,
    color2: color2 ?? theme.colors.primary,
    size: size ?? theme.illustrations.sizes.medium,
  })
)``
