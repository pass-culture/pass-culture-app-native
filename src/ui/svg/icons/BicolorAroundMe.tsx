import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const BicolorAroundMeSvg: React.FunctionComponent<AccessibleIcon> = ({
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
        clipRule="evenodd"
        fillRule="evenodd"
        d="M24 5.45459C13.4796 5.45459 4.95459 13.9796 4.95459 24.5C4.95459 35.0205 13.4796 43.5455 24 43.5455C34.5205 43.5455 43.0455 35.0205 43.0455 24.5C43.0455 19.2395 40.9153 14.4795 37.4679 11.0322C37.0774 10.6416 37.0774 10.0085 37.4679 9.61794C37.8585 9.22741 38.4916 9.22741 38.8822 9.61794C42.6894 13.4251 45.0455 18.6879 45.0455 24.5C45.0455 36.1251 35.6251 45.5455 24 45.5455C12.375 45.5455 2.95459 36.1251 2.95459 24.5C2.95459 12.875 12.375 3.45459 24 3.45459C24.5523 3.45459 25 3.90231 25 4.45459C25 5.00687 24.5523 5.45459 24 5.45459ZM20.4499 20.9498C22.4076 18.9922 25.5831 18.9922 27.5407 20.9498C27.9312 21.3403 28.5644 21.3403 28.9549 20.9498C29.3455 20.5593 29.3455 19.9261 28.9549 19.5356C26.2162 16.7969 21.7744 16.7969 19.0357 19.5356C16.297 22.2743 16.297 26.7161 19.0357 29.4548C21.7744 32.1935 26.2162 32.1935 28.9549 29.4548C29.3455 29.0643 29.3455 28.4311 28.9549 28.0406C28.5644 27.6501 27.9312 27.6501 27.5407 28.0406C25.5831 29.9983 22.4076 29.9983 20.4499 28.0406C18.4923 26.0829 18.4923 22.9075 20.4499 20.9498ZM25.4318 24.5001C25.4318 25.2908 24.7907 25.9319 23.9999 25.9319C23.2092 25.9319 22.5681 25.2908 22.5681 24.5001C22.5681 23.7093 23.2092 23.0682 23.9999 23.0682C24.7907 23.0682 25.4318 23.7093 25.4318 24.5001ZM11.9705 24.5C11.9705 17.855 17.355 12.4705 24 12.4705C30.645 12.4705 36.0295 17.855 36.0295 24.5C36.0295 31.145 30.645 36.5296 24 36.5296C20.6778 36.5296 17.674 35.1825 15.4957 33.0043C15.1052 32.6137 14.4721 32.6137 14.0815 33.0043C13.691 33.3948 13.691 34.028 14.0815 34.4185C16.6187 36.9557 20.1249 38.5296 24 38.5296C31.7496 38.5296 38.0295 32.2496 38.0295 24.5C38.0295 16.7504 31.7496 10.4705 24 10.4705C16.2504 10.4705 9.97046 16.7504 9.97046 24.5C9.97046 25.0523 10.4182 25.5 10.9705 25.5C11.5227 25.5 11.9705 25.0523 11.9705 24.5Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorAroundMe = styled(BicolorAroundMeSvg).attrs(
  ({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  })
)``
