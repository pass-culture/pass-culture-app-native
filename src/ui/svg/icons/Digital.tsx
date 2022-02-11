import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const DigitalSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 49"
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    aria-hidden={!accessibilityLabel}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.68 11.4054C12.11 11.4054 10.84 12.6956 10.84 14.3006V34.4048H26.9999V35.9286H27V40.5H6C4.9 40.5 4 39.5857 4 38.4683V35.9286H8V12.3705C8 10.227 9.7 8.5 11.79 8.5H41.16C42.73 8.5 44 9.80032 44 11.4054H13.68ZM42 14.0873H32C30.9 14.0873 30 15.0016 30 16.119V38.4682C30 39.5857 30.9 40.5 32 40.5H42C43.1 40.5 44 39.5857 44 38.4682V16.119C44 15.0016 43.1 14.0873 42 14.0873ZM42 36.4365H32V17.1349H42V36.4365Z"
    />
  </AccessibleSvg>
)

export const Digital = styled(DigitalSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
