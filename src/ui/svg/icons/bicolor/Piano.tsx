import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const PianoSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="6.583%" x2="93.417%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M19.15 4C10.4788 4 4 10.2206 4 18.4873C4 19.0398 4.44772 19.4878 5 19.4878C5.55228 19.4878 6 19.0398 6 18.4873C6 11.4062 11.5012 6.001 19.15 6.001C22.9105 6.001 25.6166 7.59835 27.4768 9.6275C29.3604 11.6822 30.3599 14.1668 30.6444 15.8251C31.0768 18.3485 32.0465 21.1182 34.2177 22.7151L34.2262 22.7212C35.3325 23.5286 36.6888 24 38.34 24C38.3835 24 38.4264 23.9972 38.4685 23.9918C39.7213 24.0276 40.5497 24.5878 41.1029 25.3908C41.704 26.2632 42 27.4641 42 28.6523V31.994H36H31H21H16H11H6V22.9895C6 22.4369 5.55228 21.989 5 21.989C4.44772 21.989 4 22.4369 4 22.9895V31.994V33.995V40.9985C4 42.6516 5.34772 44 7 44H33.37C33.9223 44 34.37 43.5521 34.37 42.9995C34.37 42.4469 33.9223 41.999 33.37 41.999H7C6.45228 41.999 6 41.5465 6 40.9985V33.995H10V38.9975C10 39.5501 10.4477 39.998 11 39.998C11.5523 39.998 12 39.5501 12 38.9975V33.995H15V38.9975C15 39.5501 15.4477 39.998 16 39.998C16.5523 39.998 17 39.5501 17 38.9975V33.995H20V38.9975C20 39.5501 20.4477 39.998 21 39.998C21.5523 39.998 22 39.5501 22 38.9975V33.995H30V38.9975C30 39.5501 30.4477 39.998 31 39.998C31.5523 39.998 32 39.5501 32 38.9975V33.995H35V38.9975C35 39.5501 35.4477 39.998 36 39.998C36.5523 39.998 37 39.5501 37 38.9975V33.995H42V40.9985C42 41.5465 41.5477 41.999 41 41.999H38.71C38.1577 41.999 37.71 42.4469 37.71 42.9995C37.71 43.5521 38.1577 44 38.71 44H41C42.6523 44 44 42.6516 44 40.9985V33.995V31.994V28.6523C44 27.1792 43.641 25.5487 42.7496 24.255C41.829 22.919 40.365 21.989 38.34 21.989C38.2952 21.989 38.251 21.9919 38.2078 21.9977C37.0274 21.9739 36.1259 21.6321 35.4002 21.1013L35.3969 21.0988C33.8715 19.9734 33.0228 17.863 32.6156 15.4868L32.6156 15.4866C32.2701 13.473 31.1096 10.63 28.9507 8.27496C26.7684 5.8944 23.5495 4 19.15 4ZM18 26.9915C17.4477 26.9915 17 27.4394 17 27.992C17 28.5445 17.4477 28.9925 18 28.9925H30C30.5523 28.9925 31 28.5445 31 27.992C31 27.4394 30.5523 26.9915 30 26.9915H18Z"
      />
    </AccessibleSvg>
  )
}

export const Piano = styled(PianoSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
