import React from 'react'
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
  const { id: gradientId1, fill: gradientFill1 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        d="M45.6875 20.5982L46.9375 16.6034L43.5625 14.1066V9.92458L39.5625 8.61378L38.25 4.61899H34.0625L31.5625 1.24837L27.5625 2.49675L24.0625 0L20.625 2.43433L16.625 1.18596L14.125 4.55657H9.9375L8.625 8.55137L4.625 9.86216V14.0442L1.25 16.541L2.5 20.5358L0 24.0312L2.4375 27.4642L1.1875 31.459L4.5625 33.9558V38.1378L8.5625 39.4486L9.875 43.4434H14.0625L16.5625 46.814L20.5625 45.5657L24 48L27.4375 45.5657L31.4375 46.814L33.9375 43.4434H38.125L39.4375 39.4486L43.4375 38.1378V33.9558L46.8125 31.459L45.5625 27.4642L48 24.0312L45.6875 20.5982Z"
        fill={gradientFill1}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1641 15.1602V33.7792C15.4015 33.6633 15.6705 33.6001 15.9554 33.6001H18.3293V28.3315V25.6973V13.0527H17.2742C16.1084 13.0527 15.1641 13.9958 15.1641 15.1602ZM16.0662 36.087H31.9715C32.23 36.087 32.3883 36.0501 32.4674 36.0027C32.4991 35.9869 32.5149 35.9658 32.5307 35.9395C32.5466 35.9131 32.5677 35.8552 32.5677 35.7445V34.5064H16.0662C15.5703 34.5064 15.1641 34.8594 15.1641 35.2967C15.1641 35.734 15.5703 36.087 16.0662 36.087ZM34.1556 14.6333V16.0347V18.8481V31.4927C34.1556 32.4779 33.4804 33.2893 32.573 33.5263V33.6001H19.4847V29.3853V13.0527H32.573C33.4434 13.0527 34.1556 13.764 34.1556 14.6333ZM23.6048 23.063H27.8251C28.1153 23.063 28.3527 22.8259 28.3527 22.5361C28.3527 22.2464 28.1153 22.0093 27.8251 22.0093H23.6048C23.3146 22.0093 23.0772 22.2464 23.0772 22.5361C23.0772 22.8259 23.3146 23.063 23.6048 23.063ZM23.6048 20.4287H29.9353C30.2254 20.4287 30.4628 20.1916 30.4628 19.9019C30.4628 19.6121 30.2254 19.375 29.9353 19.375H23.6048C23.3146 19.375 23.0772 19.6121 23.0772 19.9019C23.0772 20.1916 23.3146 20.4287 23.6048 20.4287Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id={gradientId1}
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
    color: color ?? theme.designSystem.color.icon.default,
    color2: color2 ?? theme.designSystem.color.icon.default,
    size: size ?? theme.icons.sizes.standard,
  })
)``
