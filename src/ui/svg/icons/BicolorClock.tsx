import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const NotMemoizedBicolorClock: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id, fill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={id} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={fill}
        d="M24 43.5909C13.4545 43.5909 4.90909 35.0455 4.90909 24.5C4.90909 21.2523 5.71845 18.1905 7.15309 15.521C7.40265 15.0566 7.22851 14.4778 6.76414 14.2283C6.29977 13.9787 5.72101 14.1529 5.47146 14.6172C3.88973 17.5604 3 20.9322 3 24.5C3 36.0999 12.4001 45.5 24 45.5C35.5999 45.5 45 36.0999 45 24.5C45 12.9001 35.5999 3.5 24 3.5C20.3809 3.5 16.9697 4.42015 13.9891 6.04046C13.5259 6.29225 13.3546 6.87183 13.6064 7.33499C13.8582 7.79816 14.4377 7.96952 14.9009 7.71773C17.6094 6.2453 20.7082 5.40909 24 5.40909C34.5455 5.40909 43.0909 13.9545 43.0909 24.5C43.0909 35.0455 34.5455 43.5909 24 43.5909ZM24.9545 11.2509C24.9545 10.7238 24.5271 10.2964 24 10.2964C23.4728 10.2964 23.0454 10.7238 23.0454 11.2509V24.5C23.0454 24.7532 23.146 24.996 23.325 25.175L29.0523 30.9023C29.425 31.275 30.0294 31.275 30.4022 30.9023C30.775 30.5295 30.775 29.9251 30.4022 29.5523L24.9545 24.1046V11.2509Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorClock = React.memo(
  styled(NotMemoizedBicolorClock).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)

export const Clock = React.memo(
  styled(NotMemoizedBicolorClock).attrs(({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    color2: color ?? theme.colors.black,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
