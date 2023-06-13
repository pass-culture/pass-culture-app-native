import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function EditPenSvg({
  size,
  color,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      fill={color}
      viewBox="0 0 48 48">
      <Path d="M36.4219 6.5C34.9917 6.5 33.5616 7.04735 32.4666 8.13088L30.967 9.63019C32.5289 10.1393 34.5618 11.016 36.0759 12.614C37.4974 14.1142 38.3978 16.0323 38.9388 17.444L40.3659 16.0172C42.5447 13.8389 42.5447 10.2979 40.3659 8.11971C39.2822 7.04735 37.852 6.5 36.4219 6.5ZM37.3674 19.0222C36.9149 17.6891 36.1214 15.5793 34.619 13.9938C33.0858 12.3757 30.8767 11.6709 29.3571 11.249C29.3548 11.2519 29.3525 11.2548 29.3502 11.2577L9.22681 31.3763L9.33728 31.4577C9.28557 31.5332 9.24363 31.6168 9.21359 31.7068L6.05163 41.1792C5.9313 41.5397 6.02505 41.9373 6.29379 42.206C6.56253 42.4748 6.96011 42.5687 7.32073 42.4485L16.8066 39.2873C16.8969 39.2572 16.9807 39.2151 17.0564 39.1632L17.1373 39.2738L37.3492 19.0554L37.3674 19.0222ZM15.2512 37.5315C15.2708 37.5804 15.2889 37.6275 15.3054 37.6727L10.4059 39.3055C10.3547 39.1839 10.2904 39.0569 10.2098 38.9275C9.98994 38.575 9.67418 38.2446 9.23988 37.9658L10.8296 33.2034C10.8754 33.22 10.9231 33.2381 10.9727 33.2578C11.5742 33.4975 12.4678 33.9911 13.4893 35.0124C14.5115 36.0344 15.0086 36.9288 15.2512 37.5315Z" />
    </AccessibleSvg>
  )
}

export const EditPen = styled(EditPenSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
