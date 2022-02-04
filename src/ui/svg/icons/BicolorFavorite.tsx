import React, { memo } from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorFavorite: React.FC<BicolorIconInterface> = ({
  size,
  color,
  color2,
  thin,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <Svg width={size} height={size} viewBox="0 0 27 22" testID={testID} aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M7.12508 0.5C3.42422 0.5 0.416748 3.47715 0.416748 7.15506C0.416748 10.4655 2.28131 13.6111 4.73463 16.1141C7.19463 18.6241 10.3248 20.5704 13.025 21.4692C13.1418 21.508 13.2678 21.509 13.3851 21.4719C15.2534 20.8811 16.4211 20.157 17.733 19.2817C18.001 19.1029 18.0733 18.7407 17.8945 18.4727C17.7157 18.2047 17.3535 18.1324 17.0855 18.3112C15.853 19.1336 14.8226 19.7708 13.2142 20.3011C10.7438 19.4395 7.85457 17.6306 5.56783 15.2975C3.21885 12.9009 1.58341 10.0331 1.58341 7.15506C1.58341 4.13072 4.05927 1.66667 7.12508 1.66667C10.1909 1.66667 12.6667 4.13072 12.6667 7.15506C12.6667 7.47722 12.9279 7.73839 13.2501 7.73839C13.5722 7.73839 13.8334 7.47722 13.8334 7.15506C13.8334 4.13072 16.3093 1.66667 19.3751 1.66667C22.4409 1.66667 24.9167 4.13072 24.9167 7.15506C24.9167 10.4837 22.9467 12.7032 21.4019 14.4437C21.2789 14.5823 21.1586 14.7178 21.0422 14.8507C20.8299 15.093 20.8542 15.4615 21.0965 15.6738C21.3387 15.8862 21.7073 15.8619 21.9196 15.6196C22.0365 15.4862 22.1605 15.3472 22.2896 15.2023L22.2899 15.202C23.82 13.4859 26.0834 10.9474 26.0834 7.15506C26.0834 3.47715 23.0759 0.5 19.3751 0.5C16.6487 0.5 14.2987 2.1157 13.2501 4.437C12.2015 2.1157 9.85144 0.5 7.12508 0.5ZM6.27355 5.0742C6.54465 4.90014 6.62332 4.53927 6.44926 4.26817C6.2752 3.99707 5.91433 3.91841 5.64323 4.09246C4.49009 4.83283 3.64247 6.01335 3.34634 7.39528C3.27884 7.71029 3.47949 8.02038 3.7945 8.08788C4.10952 8.15539 4.41961 7.95474 4.48711 7.63973C4.71599 6.57165 5.37336 5.65217 6.27355 5.0742Z"
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke={gradientFill}
        strokeWidth={thin ? 0 : 0.3}
      />
    </Svg>
  )
}

export const BicolorFavorite = memo(
  styled(NotMemoizedBicolorFavorite).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
