import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BicolorRingingBellOffSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        fill={gradientFill}
        d="M133.919 17.65c10.14 0 18.36 8.24 18.35 18.38a2.5 2.5 0 0 0 5 0c.01-12.91-10.44-23.38-23.35-23.39a2.5 2.5 0 0 0 0 5v.01Z"
      />
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        d="M160.399 97.12c-1.02-5.43-6.24-9-11.68-7.98a4.985 4.985 0 0 1-5.83-3.99l-4.62-24.57c-1.97-10.45-7.41-18.38-14.84-23.21-4.72-3.08-10.18-4.87-15.96-5.3l-.47-2.5c-.97-5.14-6.44-7.69-11.44-6.75-5 .94-9.18 5.3-8.21 10.45l.46 2.49c-3.74 1.8-7.09 4.18-9.9 7.08-.23.24-.4.5-.51.79-.39.91-.2 2.01.56 2.74.74.71 1.8.89 2.7.52.3-.13.59-.32.84-.57 4.26-4.39 10.07-7.49 16.83-8.76 8.25-1.55 16.14-.06 22.37 4 6.22 4.04 10.93 10.74 12.65 19.95l4.62 24.57a9.908 9.908 0 0 0 2.24 4.66l-8.68 1.64a2.497 2.497 0 0 0-2 2.91c.05.27.14.52.28.75.22.42.57.76.98.98.49.27 1.07.38 1.66.27l17.2-3.23a4.985 4.985 0 0 1 5.84 3.99 4.985 4.985 0 0 1-3.99 5.83l-7 1.31c-1.98.37-2.73 2.81-1.31 4.23.58.58 1.42.84 2.23.69l6.99-1.32c5.44-1.02 9-6.24 7.98-11.68l.01.01Zm-62.99-64.47c-1.67.31-3.29.73-4.86 1.23l-.29-1.53c-.31-1.64 1.06-4.02 4.22-4.61 3.16-.6 5.3 1.12 5.61 2.76l.29 1.53c-1.65.1-3.31.31-4.97.62Zm29.93 75.77-6.55 1.23-47.92 9.01a4.985 4.985 0 0 1-5.83-3.99 4.97 4.97 0 0 1 3.99-5.83l36.85-6.93a2.507 2.507 0 0 0 1.91-3.26c-.25-.75-.85-1.32-1.56-1.56-.4-.14-.83-.18-1.27-.1l-28.34 5.33c.56-1.6.72-3.37.39-5.16l-4.62-24.57c-.62-3.29-.76-6.44-.49-9.39.01-.15.01-.29 0-.44a2.481 2.481 0 0 0-2.26-2.27h-.01c-1.38-.13-2.58.88-2.71 2.26-.31 3.42-.15 7.03.55 10.76l4.62 24.57a4.99 4.99 0 0 1-3.99 5.84c-5.43 1.02-9 6.24-7.98 11.68 1.02 5.43 6.24 9 11.68 7.98l10.23-1.93c-.02.83.06 1.67.21 2.51 1.28 6.79 7.81 11.25 14.6 9.98 6.78-1.28 11.25-7.81 9.97-14.6-.16-.85-.4-1.65-.71-2.41l16.98-3.19 6.55-1.23 5.95-1.12-4.29-4.29-5.95 1.12Zm-29.43 20.8a7.485 7.485 0 0 1-8.75-5.98c-.16-.82-.17-1.62-.07-2.37a.88.88 0 0 0 .02-.17l13.9-2.62c.42.73.73 1.52.89 2.39a7.484 7.484 0 0 1-5.99 8.75Z"
        clipRule="evenodd"
      />
      <Path
        fill={gradientFill}
        d="M139.29 38.97a8.38 8.38 0 0 0-8.36-8.38 2.5 2.5 0 0 1 0-5c7.38 0 13.37 6 13.36 13.38a2.5 2.5 0 0 1-5 0Z"
      />
      <Path
        fill={gradientFill}
        d="M57.34 121.51a5.734 5.734 0 0 0 5.22 6.22c1.38.12 2.39 1.33 2.27 2.71a2.494 2.494 0 0 1-2.71 2.27c-5.91-.52-10.28-5.73-9.76-11.64a2.494 2.494 0 0 1 2.71-2.27c1.38.12 2.39 1.33 2.27 2.71Z"
      />
      <Path
        fill={gradientFill}
        d="M59.35 138.36c-7.86-.69-13.66-7.62-12.97-15.48a2.5 2.5 0 0 0-4.98-.44c-.93 10.61 6.91 19.96 17.51 20.9a2.5 2.5 0 0 0 2.71-2.27c.12-1.37-.9-2.59-2.27-2.71Z"
      />
      <Path
        stroke={gradientFill}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={5}
        d="m50.08 27.62 110.209 110.22"
      />
    </AccessibleSvg>
  )
}

export const BicolorRingingBellOff = styled(BicolorRingingBellOffSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``
