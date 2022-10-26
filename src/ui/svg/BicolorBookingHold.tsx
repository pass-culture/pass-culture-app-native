import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BicolorBookingHoldSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="28.841%"
          x2="71.159%"
          y1="0%"
          y2="100%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M71.184 133.998c-3.662 2.107-8.93.678-11.584-3.906l-5.64-9.74c-.546-.942-.406-2.179.404-3.021l.012-.013c5.147-5.429 5.977-14.105 1.867-21.203-4.11-7.097-12.061-10.72-19.35-8.99l-.017.005c-1.144.28-2.271-.204-2.826-1.162l-5.64-9.74c-2.654-4.584-1.261-9.848 2.4-11.956l73.427-42.27c3.663-2.107 8.931-.678 11.586 3.906l5.64 9.74c.545.942.405 2.179-.405 3.021l-.012.013c-5.146 5.429-5.976 14.105-1.866 21.203 4.107 7.093 12.035 10.734 19.352 8.989l.014-.004c1.144-.28 2.272.204 2.826 1.162l3.69 6.372C131.8 78.667 121.711 90.16 121.711 104c0 15.466 12.598 28 28.144 28C165.402 132 178 119.466 178 104c0-4.825-1.233-9.374-3.405-13.349a2.241 2.241 0 0 0-3.031-.891 2.218 2.218 0 0 0-.896 3.015A23.328 23.328 0 0 1 173.531 104c0 13.011-10.597 23.554-23.676 23.554-13.078 0-23.675-10.543-23.675-23.554s10.597-23.554 23.675-23.554c4.03 0 7.826.999 11.133 2.767a2.24 2.24 0 0 0 3.026-.906 2.218 2.218 0 0 0-.911-3.01 27.997 27.997 0 0 0-12.39-3.284l-2.15-3.627-2.82-4.87c-1.715-2.963-5.149-4.325-8.392-3.535-4.92 1.17-10.693-1.245-13.801-6.612-3.105-5.364-2.301-11.57 1.159-15.225 2.311-2.411 2.823-6.078 1.124-9.012l-5.639-9.74c-3.805-6.57-12.003-9.476-18.48-5.747L28.287 59.914c-6.477 3.729-8.052 12.26-4.247 18.83l5.64 9.74c1.715 2.962 5.147 4.324 8.389 3.535 4.904-1.16 10.698 1.249 13.803 6.612 3.105 5.363 2.301 11.57-1.158 15.225-2.312 2.41-2.824 6.078-1.125 9.012l5.64 9.74c3.805 6.571 12.002 9.476 18.48 5.747l38.745-22.362a2.512 2.512 0 0 0 .92-3.438 2.526 2.526 0 0 0-3.447-.918l-38.743 22.361Z"
        fill={gradientFill}
      />
      <Path
        d="M110.94 93.659a2.527 2.527 0 0 1-3.447-.921l-20.25-34.972a2.512 2.512 0 0 1 .923-3.437 2.527 2.527 0 0 1 3.447.92l20.25 34.973a2.512 2.512 0 0 1-.923 3.437Z"
        fill={gradientFill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M149.855 87.25a2.25 2.25 0 0 1 2.25 2.25v13.546l5.986 5.986a2.25 2.25 0 1 1-3.182 3.182l-6.645-6.645a2.25 2.25 0 0 1-.659-1.591V89.5a2.25 2.25 0 0 1 2.25-2.25Z"
        fill={gradientFill}
      />
    </AccessibleSvg>
  )
}

export const BicolorBookingHold = styled(BicolorBookingHoldSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
