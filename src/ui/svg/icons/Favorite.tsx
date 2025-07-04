import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const FavoriteSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 49"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={color}
      d="M2 19.9087C2 13.6037 7.15567 8.5 13.5 8.5C18.1738 8.5 22.2024 11.2698 24 15.2492C25.7976 11.2698 29.8262 8.5 34.5 8.5C40.8443 8.5 46 13.6037 46 19.9087C46 26.4098 42.1198 30.7616 39.4969 33.7034C39.2753 33.9519 39.0626 34.1904 38.8621 34.4193C38.4981 34.8347 37.8663 34.8763 37.4509 34.5123C37.0356 34.1483 36.9939 33.5165 37.3579 33.1011C37.5575 32.8734 37.7637 32.641 37.9746 32.4035C40.6228 29.4198 44 25.6149 44 19.9087C44 14.7241 39.7557 10.5 34.5 10.5C29.2443 10.5 25 14.7241 25 19.9087C25 20.461 24.5523 20.9087 24 20.9087C23.4477 20.9087 23 20.461 23 19.9087C23 14.7241 18.7557 10.5 13.5 10.5C8.24433 10.5 4 14.7241 4 19.9087C4 24.8425 6.8036 29.7587 10.8304 33.8672C14.7505 37.8668 19.7035 40.9677 23.9385 42.4448C26.6958 41.5357 28.4621 40.4432 30.575 39.0335C31.0344 38.7269 31.6553 38.8509 31.9618 39.3103C32.2684 39.7697 32.1444 40.3906 31.685 40.6971C29.4361 42.1977 27.4343 43.439 24.2315 44.4518C24.0304 44.5154 23.8143 44.5138 23.6142 44.4471C18.9852 42.9063 13.6192 39.5698 9.40208 35.2671C5.1964 30.9761 2 25.5837 2 19.9087Z"
    />
  </AccessibleSvg>
)

export const Favorite = styled(FavoriteSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
