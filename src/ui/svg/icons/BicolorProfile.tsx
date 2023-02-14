import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const NotMemoizedBicolorProfile: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID = 'BicolorProfile',
  opacity,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48"
      fill={gradientFill}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        opacity={opacity}
        d="M19.0098 7.14972C20.0941 5.54503 21.9247 4.5 24.0075 4.5C27.3384 4.5 30.0272 7.18457 30.0272 10.5V15.5C30.0272 18.8154 27.3384 21.5 24.0075 21.5C20.6766 21.5 17.9878 18.8154 17.9878 15.5V10.5C17.9878 9.2548 18.3663 8.09935 19.0091 7.15079L19.0098 7.14972ZM24.0075 2.5C21.2365 2.5 18.795 3.89474 17.352 6.02974C16.4907 7.30109 15.9868 8.84543 15.9868 10.5V15.5C15.9868 19.9246 19.5761 23.5 24.0075 23.5C28.4389 23.5 32.0281 19.9246 32.0281 15.5V10.5C32.0281 6.07543 28.4389 2.5 24.0075 2.5ZM23.9974 25.75C16.0794 25.75 9.45306 31.1381 7.53537 38.4256C7.44859 38.7554 7.53589 39.1066 7.76697 39.3574C11.7975 43.7322 17.5658 46.5 24.0075 46.5C25.7723 46.5 27.4742 46.2904 29.1118 45.9031C29.6495 45.776 29.9822 45.2372 29.855 44.6998C29.7278 44.1623 29.1888 43.8297 28.6511 43.9569C27.1597 44.3096 25.6123 44.5 24.0075 44.5C18.3535 44.5 13.269 42.1563 9.62014 38.4053C11.4871 32.2431 17.2056 27.75 23.9974 27.75C30.7903 27.75 36.5179 32.2441 38.3849 38.4061C37.4302 39.39 36.3746 40.2802 35.2317 41.0511C34.7737 41.36 34.653 41.9816 34.962 42.4394C35.2711 42.8972 35.8929 43.0178 36.3509 42.7089C37.7819 41.7437 39.0845 40.612 40.2386 39.3566C40.4692 39.1058 40.5562 38.755 40.4695 38.4256C38.5516 31.1374 31.9147 25.75 23.9974 25.75Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorProfile = React.memo(
  styled(NotMemoizedBicolorProfile).attrs(({ color, color2, size, theme, opacity }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    opacity: opacity ?? 1,
  }))``
)
