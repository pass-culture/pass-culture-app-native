import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorSearch: React.FC<BicolorIconInterface> = ({
  size,
  color,
  color2,
  thin,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" testID={testID} aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M9.05767 1.5153C4.75505 1.5153 1.26493 5.00541 1.26493 9.30804C1.26493 13.6107 4.75505 17.1008 9.05767 17.1008C13.3603 17.1008 16.8504 13.6107 16.8504 9.30804C16.8504 8.22133 16.6275 7.18019 16.227 6.24009C16.1007 5.9437 16.2386 5.60107 16.535 5.47479C16.8314 5.34852 17.174 5.48643 17.3003 5.78282C17.7613 6.86494 18.0171 8.06141 18.0171 9.30804C18.0171 14.255 14.0046 18.2674 9.05767 18.2674C4.11072 18.2674 0.0982666 14.255 0.0982666 9.30804C0.0982666 4.36108 4.11072 0.348633 9.05767 0.348633C11.3417 0.348633 13.4226 1.20034 15.0089 2.60756C15.2499 2.82135 15.2719 3.19004 15.0581 3.43104C14.8444 3.67205 14.4757 3.6941 14.2347 3.48031C12.8535 2.25504 11.0454 1.5153 9.05767 1.5153ZM16.423 16.6733C16.6508 16.4455 17.0202 16.4455 17.248 16.6733L23.2309 22.6562C23.4587 22.8841 23.4587 23.2534 23.2309 23.4812C23.0031 23.709 22.6337 23.709 22.4059 23.4812L16.423 17.4983C16.1952 17.2705 16.1952 16.9011 16.423 16.6733ZM4.58532 6.6594C4.74766 6.38113 4.65368 6.02394 4.37541 5.8616C4.09714 5.69926 3.73995 5.79324 3.5776 6.07151C2.8269 7.35829 1.71517 10.519 4.33069 13.5602C4.54076 13.8045 4.90906 13.8322 5.15332 13.6222C5.39758 13.4121 5.4253 13.0438 5.21523 12.7995C3.06398 10.2981 3.95685 7.73667 4.58532 6.6594Z"
        fill={gradientFill}
        stroke={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        strokeWidth={thin ? 0 : 0.3}
      />
    </Svg>
  )
}

export const BicolorSearch = React.memo(
  styled(NotMemoizedBicolorSearch).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
