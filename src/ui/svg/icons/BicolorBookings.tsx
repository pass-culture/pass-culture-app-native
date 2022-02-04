import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorBookings: React.FC<BicolorIconInterface> = ({
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
        fill={gradientFill}
        stroke={gradientFill}
        strokeWidth={thin ? 0 : 0.3}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.83329 3.79C1.83329 2.56263 2.72221 1.6668 3.69973 1.66667L18.3645 1.67833C18.6867 1.67859 18.948 1.41763 18.9483 1.09546C18.9485 0.773298 18.6876 0.511923 18.3654 0.511667L3.69996 0.5C1.9709 0.5 0.666626 2.0308 0.666626 3.79V6.3975C0.666626 7.18288 1.19425 7.86016 1.93657 8.077C3.05279 8.41089 3.93329 9.56424 3.93329 11C3.93329 12.4358 3.05271 13.5892 1.93641 13.923C1.19587 14.1394 0.666626 14.8096 0.666626 15.6025V18.21C0.666626 19.9692 1.9709 21.5 3.69996 21.5H23.3C25.029 21.5 26.3333 19.9692 26.3333 18.21V15.6025C26.3333 14.8172 25.8058 14.14 25.0635 13.9231C23.9472 13.5892 23.0666 12.4358 23.0666 11C23.0666 9.56296 23.9424 8.41073 25.063 8.07709C25.8038 7.86086 26.3333 7.19054 26.3333 6.3975V3.79C26.3333 2.0308 25.029 0.5 23.3 0.5C22.9778 0.5 22.7166 0.761167 22.7166 1.08333C22.7166 1.4055 22.9778 1.66667 23.3 1.66667C24.2776 1.66667 25.1666 2.56253 25.1666 3.79V6.3975C25.1666 6.65378 24.997 6.88133 24.7355 6.95735L24.7322 6.95832C23.0651 7.45355 21.9 9.10097 21.9 11C21.9 12.9002 23.0719 14.5464 24.7315 15.0415L24.7355 15.0426C24.9953 15.1182 25.1666 15.3503 25.1666 15.6025V18.21C25.1666 19.4375 24.2776 20.3333 23.3 20.3333H3.69996C2.72235 20.3333 1.83329 19.4375 1.83329 18.21V15.6025C1.83329 15.3462 2.00292 15.1187 2.26446 15.0427L2.26838 15.0415C3.92802 14.5464 5.09996 12.9002 5.09996 11C5.09996 9.09982 3.92803 7.4536 2.26839 6.9585L2.26446 6.95735C2.00461 6.88182 1.83329 6.64967 1.83329 6.3975V3.79ZM16.4166 6.35085C16.4166 6.02868 16.1555 5.76752 15.8333 5.76752C15.5111 5.76752 15.25 6.02868 15.25 6.35085V15.7134C15.25 16.0355 15.5111 16.2967 15.8333 16.2967C16.1555 16.2967 16.4166 16.0355 16.4166 15.7134V6.35085Z"
      />
    </Svg>
  )
}

export const BicolorBookings = React.memo(
  styled(NotMemoizedBicolorBookings).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
