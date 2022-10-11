import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ValidSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={color}
      d="M24 43.0909C13.4545 43.0909 4.90909 34.5455 4.90909 24C4.90909 20.7523 5.71845 17.6905 7.15309 15.021C7.40265 14.5566 7.22851 13.9778 6.76414 13.7283C6.29977 13.4787 5.72101 13.6529 5.47145 14.1172C3.88973 17.0604 3 20.4322 3 24C3 35.5999 12.4001 45 24 45C35.5999 45 45 35.5999 45 24C45 12.4001 35.5999 3 24 3C20.3809 3 16.9697 3.92015 13.9891 5.54046C13.5259 5.79225 13.3546 6.37183 13.6064 6.835C13.8582 7.29816 14.4377 7.46952 14.9009 7.21773C17.6094 5.7453 20.7082 4.90909 24 4.90909C34.5455 4.90909 43.0909 13.4545 43.0909 24C43.0909 34.5455 34.5455 43.0909 24 43.0909ZM34.1925 17.7781C34.5912 18.1602 34.6046 18.7933 34.2224 19.192L32.9424 20.5274L32.9377 20.5323L22.052 31.8866L22.0518 31.8868C21.2681 32.7044 19.9766 32.7044 19.1929 31.8866L19.1905 31.884L13.7753 26.1921C13.3946 25.7919 13.4104 25.159 13.8105 24.7783C14.2106 24.3976 14.8436 24.4134 15.2243 24.8135L20.6225 30.4877L31.4985 19.1435L31.4986 19.1435L31.5031 19.1388L32.7786 17.808C33.1607 17.4093 33.7938 17.3959 34.1925 17.7781Z"
    />
  </AccessibleSvg>
)

export const Valid = styled(ValidSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
