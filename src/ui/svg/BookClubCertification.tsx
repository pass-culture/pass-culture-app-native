import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BookClubCertificationSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.8125 24.0314C8.8125 15.6049 15.6875 8.80127 24.0625 8.80127C32.4375 8.80127 39.3125 15.6049 39.3125 24.0314C39.3125 32.458 32.4375 39.2616 24.0625 39.2616C15.6875 39.2616 8.8125 32.458 8.8125 24.0314ZM16.25 30.9352V16.2293C16.25 15.3097 16.9958 14.5648 17.9167 14.5648H18.75V24.5518V26.6324V30.7937H16.875C16.65 30.7937 16.4375 30.8436 16.25 30.9352ZM29.525 32.7577H16.9625C16.5708 32.7577 16.25 32.4789 16.25 32.1335C16.25 31.7882 16.5708 31.5094 16.9625 31.5094H29.9958V32.4872C29.9958 32.5746 29.9792 32.6204 29.9667 32.6412C29.9542 32.662 29.9417 32.6787 29.9167 32.6912C29.8542 32.7286 29.7292 32.7577 29.525 32.7577ZM31.2502 16.9201V15.8132C31.2502 15.1266 30.6877 14.5648 30.0002 14.5648H19.6627V27.4647V30.7937H30.0002V30.7354C30.7168 30.5482 31.2502 29.9073 31.2502 29.1292V19.1422V16.9201ZM26.2502 22.4712H22.9168C22.6877 22.4712 22.5002 22.2839 22.5002 22.0551C22.5002 21.8262 22.6877 21.6389 22.9168 21.6389H26.2502C26.4793 21.6389 26.6668 21.8262 26.6668 22.0551C26.6668 22.2839 26.4793 22.4712 26.2502 22.4712ZM27.9168 20.3906H22.9168C22.6877 20.3906 22.5002 20.2033 22.5002 19.9744C22.5002 19.7456 22.6877 19.5583 22.9168 19.5583H27.9168C28.146 19.5583 28.3335 19.7456 28.3335 19.9744C28.3335 20.2033 28.146 20.3906 27.9168 20.3906Z"
        fill={gradientFill}
      />
      <Path
        d="M45.6875 20.5982L46.9375 16.6034L43.5625 14.1066V9.92458L39.5625 8.61378L38.25 4.61899H34.0625L31.5625 1.24837L27.5625 2.49675L24.0625 0L20.625 2.43433L16.625 1.18596L14.125 4.55657H9.9375L8.625 8.55137L4.625 9.86216V14.0442L1.25 16.541L2.5 20.5358L0 24.0312L2.4375 27.4642L1.1875 31.459L4.5625 33.9558V38.1378L8.5625 39.4486L9.875 43.4434H14.0625L16.5625 46.814L20.5625 45.5657L24 48L27.4375 45.5657L31.4375 46.814L33.9375 43.4434H38.125L39.4375 39.4486L43.4375 38.1378V33.9558L46.8125 31.459L45.5625 27.4642L48 24.0312L45.6875 20.5982ZM24.0625 41.2588C14.5625 41.2588 6.8125 33.5189 6.8125 24.0312C6.8125 14.5436 14.5625 6.80364 24.0625 6.80364C33.5625 6.80364 41.3125 14.5436 41.3125 24.0312C41.3125 33.5189 33.5625 41.2588 24.0625 41.2588Z"
        fill={gradientFill}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="24.0625"
          y1="8.80127"
          x2="24.0625"
          y2="39.2616"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
        <LinearGradient
          id={gradientId}
          x1="24"
          y1="0"
          x2="24"
          y2="48"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const BookClubCertification = styled(BookClubCertificationSvg).attrs(
  ({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.skyBlue,
    color2: color2 ?? theme.colors.skyBlueDark,
    size: size ?? theme.icons.sizes.standard,
  })
)``
