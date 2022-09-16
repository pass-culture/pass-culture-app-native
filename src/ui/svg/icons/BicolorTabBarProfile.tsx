import * as React from 'react'
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIconInterface } from './types'

const NotMemoizedBicolorTabBarProfile: React.FC<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  thin,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 20 26"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M10.0044 1.33366C8.78947 1.33366 7.72162 1.94326 7.08908 2.87933L7.08866 2.87995C6.71371 3.43328 6.4929 4.10729 6.4929 4.83366V7.75033C6.4929 9.68433 8.06137 11.2503 10.0044 11.2503C11.9474 11.2503 13.5159 9.68432 13.5159 7.75033V4.83366C13.5159 2.89966 11.9474 1.33366 10.0044 1.33366ZM6.12206 2.22601C6.96379 0.980588 8.38799 0.166992 10.0044 0.166992C12.5894 0.166992 14.6831 2.25266 14.6831 4.83366V7.75033C14.6831 10.3313 12.5894 12.417 10.0044 12.417C7.41942 12.417 5.3257 10.3313 5.3257 7.75033V4.83366C5.3257 3.86849 5.61961 2.96763 6.12206 2.22601ZM0.395672 21.1236C1.51432 16.8725 5.37967 13.7295 9.99854 13.7295C14.617 13.7295 18.4885 16.8721 19.6073 21.1236C19.6578 21.3157 19.6071 21.5204 19.4726 21.6667C18.7994 22.399 18.0395 23.0591 17.2048 23.6222C16.9376 23.8024 16.5748 23.732 16.3946 23.465C16.2143 23.1979 16.2847 22.8353 16.5519 22.6551C17.2185 22.2054 17.8343 21.6862 18.3913 21.1122C17.3021 17.5177 13.961 14.8962 9.99854 14.8962C6.03662 14.8962 2.70085 17.5171 1.61179 21.1118C3.74026 23.2998 6.70625 24.667 10.0044 24.667C10.9405 24.667 11.8432 24.5559 12.7132 24.3502C13.0268 24.276 13.3413 24.47 13.4155 24.7835C13.4897 25.097 13.2956 25.4113 12.9819 25.4855C12.0267 25.7114 11.0339 25.8337 10.0044 25.8337C6.24677 25.8337 2.88193 24.2191 0.530775 21.6671C0.395979 21.5208 0.345054 21.316 0.395672 21.1236ZM7.05904 18.01C7.33881 17.85 7.43586 17.4937 7.27582 17.214C7.11577 16.9344 6.75923 16.8374 6.47946 16.9973C5.13772 17.7646 4.04903 18.9572 3.42449 20.4187C3.29789 20.715 3.43555 21.0577 3.73195 21.1843C4.02836 21.3108 4.37127 21.1732 4.49788 20.877C5.01997 19.6552 5.93203 18.6544 7.05904 18.01Z"
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke={gradientFill}
        strokeWidth={thin ? 0 : 0.3}
      />
    </AccessibleSvg>
  )
}

export const BicolorTabBarProfile = React.memo(
  styled(NotMemoizedBicolorTabBarProfile).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
