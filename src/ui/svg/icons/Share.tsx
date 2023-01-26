import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ShareSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    fill={color}
    viewBox="0 0 48 49">
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.7024 0.794719C24.5149 0.606887 24.2604 0.501343 23.995 0.501343C23.7296 0.501343 23.4751 0.606887 23.2876 0.794719L17.2893 6.80291C16.8991 7.1937 16.8996 7.82687 17.2902 8.21712C17.6809 8.60738 18.3139 8.60695 18.7041 8.21616L22.9953 3.91789V31.5423C22.9953 32.0946 23.443 32.5423 23.9953 32.5423C24.5476 32.5423 24.9953 32.0946 24.9953 31.5423V3.91844L29.2859 8.21616C29.6761 8.60695 30.3091 8.60738 30.6998 8.21712C31.0904 7.82687 31.0909 7.1937 30.7007 6.80291L24.7024 0.794719ZM10.1888 14.5045C8.98274 14.5045 7.99944 15.4897 7.99944 16.7038V40.2962C7.99944 41.5103 8.98274 42.4955 10.1888 42.4955H37.8112C39.0173 42.4955 40.0006 41.5103 40.0006 40.2962V16.7038C40.0006 15.4897 39.0173 14.5045 37.8112 14.5045H30.3732C29.8211 14.5045 29.3735 14.0558 29.3735 13.5023C29.3735 12.9487 29.8211 12.5 30.3732 12.5H37.8112C40.1241 12.5 42 14.3852 42 16.7038V40.2962C42 42.6148 40.1241 44.5 37.8112 44.5H10.1888C7.87591 44.5 6 42.6148 6 40.2962V16.7038C6 14.3852 7.87591 12.5 10.1888 12.5H17.6268C18.1789 12.5 18.6265 12.9487 18.6265 13.5023C18.6265 14.0558 18.1789 14.5045 17.6268 14.5045H10.1888Z"
    />
  </AccessibleSvg>
)

export const Share = styled(ShareSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
