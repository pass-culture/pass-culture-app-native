import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BicolorNoPhoneSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  color,
  color2,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
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
          <Stop stopColor={color} />
          <Stop offset="1" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.6061 2.20462C41.0454 2.53933 41.1302 3.16679 40.7955 3.6061L8.79548 45.6061C8.46078 46.0454 7.83331 46.1302 7.39401 45.7955C6.95471 45.4608 6.86991 44.8333 7.20462 44.394L39.2046 2.39401C39.5393 1.95471 40.1668 1.86991 40.6061 2.20462Z"
        fill={gradientFill}
      />
      <Path
        d="M13.0001 6.00005C13.0001 4.89234 13.8923 4.00005 15.0001 4.00005H23.0001V6.00005H19.0001C18.4478 6.00005 18.0001 6.44777 18.0001 7.00005C18.0001 7.55234 18.4478 8.00005 19.0001 8.00005H29.0001C29.5523 8.00005 30.0001 7.55234 30.0001 7.00005C30.0001 6.44777 29.5523 6.00005 29.0001 6.00005H25.0001V4.00005H33.0001C34.1078 4.00005 35.0001 4.89234 35.0001 6.00005V11.2251L37.0001 8.60013V6.00005C37.0001 3.78777 35.2123 2.00005 33.0001 2.00005H15.0001C12.7878 2.00005 11.0001 3.78777 11.0001 6.00005V10.2501C11.0001 10.8023 11.4478 11.2501 12.0001 11.2501C12.5523 11.2501 13.0001 10.8023 13.0001 10.2501V6.00005Z"
        fill={gradientFill}
      />
      <Path
        d="M37.0001 14.8628C37.0001 13.9056 35.7847 13.4954 35.2046 14.2567C35.0719 14.4309 35.0001 14.6438 35.0001 14.8628V39.0001H31.0001C30.4478 39.0001 30.0001 39.4478 30.0001 40.0001C30.0001 40.5523 30.4478 41.0001 31.0001 41.0001H35.0001V42.0001C35.0001 43.1078 34.1078 44.0001 33.0001 44.0001H15.0001C14.7463 44.0001 14.5038 43.9532 14.2808 43.8677C13.6869 43.64 12.8638 43.5791 12.4783 44.085C12.2163 44.4289 12.2302 44.9203 12.5739 45.1825C13.2465 45.6956 14.0871 46.0001 15.0001 46.0001H33.0001C35.2123 46.0001 37.0001 44.2123 37.0001 42.0001V14.8628Z"
        fill={gradientFill}
      />
      <Path
        d="M11.0532 42.6553L13.8382 39.0001H13.0001V16.0001C13.0001 15.4478 12.5523 15.0001 12.0001 15.0001C11.4478 15.0001 11.0001 15.4478 11.0001 16.0001V42.0001C11.0001 42.2233 11.0183 42.4421 11.0532 42.6553Z"
        fill={gradientFill}
      />
      <Path
        d="M16.8478 39.0001C16.5357 39.0001 16.2415 39.1458 16.0524 39.394C15.5509 40.0523 16.0203 41.0001 16.8478 41.0001H25.0001C25.5523 41.0001 26.0001 40.5523 26.0001 40.0001C26.0001 39.4478 25.5523 39.0001 25.0001 39.0001H16.8478Z"
        fill={gradientFill}
      />
    </AccessibleSvg>
  )
}

export const BicolorNoPhone = styled(BicolorNoPhoneSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? theme.colors.secondary,
  size: size ?? theme.icons.sizes.standard,
}))``
