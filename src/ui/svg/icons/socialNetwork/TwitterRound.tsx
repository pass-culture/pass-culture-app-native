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
        d="M35.133 18.183c.017.25.017.502.017.756 0 7.731-5.778 16.647-16.345 16.647v-.004A16.048 16.048 0 0 1 10 32.959a11.403 11.403 0 0 0 8.502-2.425c-2.458-.048-4.614-1.68-5.367-4.063.861.169 1.748.134 2.594-.101-2.68-.552-4.608-2.95-4.608-5.735v-.074a5.629 5.629 0 0 0 2.607.732c-2.524-1.718-3.303-5.138-1.778-7.812 2.916 3.655 7.22 5.877 11.839 6.113a5.924 5.924 0 0 1 1.662-5.59 5.678 5.678 0 0 1 8.127.253 11.4 11.4 0 0 0 3.648-1.42 5.856 5.856 0 0 1-2.525 3.236A11.261 11.261 0 0 0 38 15.152a11.793 11.793 0 0 1-2.867 3.03Z"
        fill="#fff"
      />
    </AccessibleSvg>
  )
}

export const TwitterRound = styled(TwitterRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
