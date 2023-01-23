import * as React from 'react'
import { Rect, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const TwitterRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Rect width={48} height={48} rx={24} fill="#1D9BF0" />
      <Path
        d="M35.531 17.975c.018.26.018.52.018.783C35.549 26.765 29.564 36 18.62 36v-.005A16.621 16.621 0 0 1 9.5 33.28a11.81 11.81 0 0 0 8.805-2.511c-2.546-.05-4.778-1.74-5.558-4.209.892.175 1.81.14 2.686-.104-2.776-.572-4.772-3.055-4.772-5.94v-.077a5.83 5.83 0 0 0 2.7.759c-2.615-1.78-3.42-5.322-1.842-8.092 3.021 3.786 7.478 6.088 12.263 6.331a6.135 6.135 0 0 1 1.72-5.79 5.88 5.88 0 0 1 8.419.263 11.811 11.811 0 0 0 3.778-1.47 6.065 6.065 0 0 1-2.616 3.35 11.665 11.665 0 0 0 3.417-.953 12.212 12.212 0 0 1-2.969 3.139Z"
        fill="#fff"
      />
    </AccessibleSvg>
  )
}

export const TwitterRound = styled(TwitterRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
