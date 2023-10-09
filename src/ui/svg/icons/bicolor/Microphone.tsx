import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

const MicrophoneSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const {
    colors: { primary, secondary },
  } = useTheme()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M16 2C12.3185 2 9.33332 4.98514 9.33332 8.66667V12H7.33332C6.96513 12 6.66666 12.2985 6.66666 12.6667V15.3333C6.66666 17.5006 7.40632 19.4975 8.64145 21.0773C8.86823 21.3673 9.28721 21.4186 9.57727 21.1919C9.86733 20.9651 9.91864 20.5461 9.69186 20.2561C8.63366 18.9025 7.99999 17.1927 7.99999 15.3333V13.3333H9.33332V15.3333C9.33332 19.0149 12.3185 22 16 22C19.6815 22 22.6667 19.0149 22.6667 15.3333V8.66667C22.6667 7.56527 22.4004 6.52708 21.9255 5.61377C21.2737 4.34778 20.2295 3.31832 18.9473 2.68832C18.6168 2.52596 18.2173 2.66222 18.055 2.99268C17.9873 3.13035 17.9715 3.28 18 3.4195V8C18 8.36819 18.2985 8.66667 18.6667 8.66667C19.0348 8.66667 19.3333 8.36819 19.3333 8V4.50397C19.9152 4.96989 20.3963 5.55607 20.7405 6.22506L20.7419 6.22772C21.1199 6.95405 21.3333 7.78199 21.3333 8.66667V15.3333C21.3333 18.2785 18.9451 20.6667 16 20.6667C13.0548 20.6667 10.6667 18.2785 10.6667 15.3333V12.6677L10.6667 12.6667L10.6667 12.6657V8.66667C10.6667 6.9827 11.4474 5.48081 12.6667 4.50333V8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8V3.72112C14.4205 3.55088 14.8676 3.43271 15.3333 3.37461V9.33333C15.3333 9.70152 15.6318 10 16 10C16.3682 10 16.6667 9.70152 16.6667 9.33333V2.66667C16.6667 2.29848 16.3682 2 16 2ZM25.3333 12.6667C25.3333 12.2985 25.0348 12 24.6667 12C24.2985 12 24 12.2985 24 12.6667V15.3333C24 19.7518 20.4185 23.3333 16 23.3333C14.5278 23.3333 13.1571 22.9396 11.9702 22.2447C11.6524 22.0587 11.244 22.1654 11.058 22.4832C10.872 22.8009 10.9787 23.2093 11.2965 23.3953C12.5016 24.1009 13.87 24.5404 15.3333 24.6433V28.6667H11.3333C10.9651 28.6667 10.6667 28.9651 10.6667 29.3333C10.6667 29.7015 10.9651 30 11.3333 30H20.6666C21.0348 30 21.3333 29.7015 21.3333 29.3333C21.3333 28.9651 21.0343 28.6667 20.6661 28.6667H16.6667V24.6432C21.5103 24.3014 25.3333 20.264 25.3333 15.3333V12.6667Z"
      />
    </AccessibleSvg>
  )
}

export const Microphone = styled(MicrophoneSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
