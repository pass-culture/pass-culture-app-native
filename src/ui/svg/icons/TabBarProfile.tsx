import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleBicolorIcon } from './types'

const NotMemoizedTabBarProfile: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        d="M12.2988 15.65C15.7782 15.65 18.5988 17.5304 18.5988 19.85C18.5988 21.1196 15.7782 23 12.2988 23C8.81943 23 5.99883 21.1196 5.99883 19.85C5.99883 17.5304 8.81943 15.65 12.2988 15.65ZM12.2988 1C18.374 1 23.2988 5.92487 23.2988 12C23.2988 13.1412 23.1248 14.2598 22.7865 15.327C22.6614 15.7219 22.2398 15.9405 21.845 15.8153C21.4501 15.6902 21.2315 15.2686 21.3566 14.8738C21.6485 13.9528 21.7988 12.987 21.7988 12C21.7988 6.75329 17.5455 2.5 12.2988 2.5C7.05212 2.5 2.79883 6.75329 2.79883 12C2.79883 12.9788 2.94661 13.9367 3.23379 14.8508C3.35794 15.246 3.13822 15.667 2.74305 15.7911C2.34788 15.9153 1.92689 15.6956 1.80275 15.3004C1.47 14.2412 1.29883 13.1317 1.29883 12C1.29883 5.92487 6.2237 1 12.2988 1ZM12.2988 7C13.9557 7 15.2988 8.34315 15.2988 10C15.2988 11.6569 13.9557 13 12.2988 13C10.642 13 9.29883 11.6569 9.29883 10C9.29883 8.34315 10.642 7 12.2988 7Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </AccessibleSvg>
  )
}

export const TabBarProfile = React.memo(
  styled(NotMemoizedTabBarProfile).attrs(({ color, size, theme }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
