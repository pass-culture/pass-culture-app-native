import * as React from 'react'
import { Path, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const ViberRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Rect width={48} height={48} rx={24} fill="#7B519D" />
      <Path
        d="M35.812 30.058c-.873-.698-1.834-1.31-2.707-2.008-1.834-1.31-3.493-1.397-4.89.699-.786 1.135-1.834 1.222-2.97.698-3.056-1.397-5.501-3.58-6.898-6.724-.612-1.397-.612-2.62.873-3.668.786-.524 1.572-1.135 1.485-2.27-.088-1.485-3.668-6.463-5.065-6.986-.612-.262-1.136-.175-1.747 0-3.319 1.135-4.716 3.842-3.406 7.073 3.842 9.78 10.829 16.592 20.348 20.697.523.262 1.135.349 1.484.436 2.183 0 4.716-2.096 5.502-4.191.698-2.009-.786-2.795-2.009-3.756ZM25.07 10.497c6.987 1.048 10.218 4.367 11.091 11.44.088.611-.174 1.66.786 1.66.961 0 .699-.961.786-1.573.088-6.637-5.676-12.75-12.4-13.011-.524.087-1.572-.35-1.66.786-.087.698.787.61 1.398.698Z"
        fill="#fff"
      />
      <Path
        d="M26.468 12.418c-.698-.087-1.572-.436-1.747.524-.174.961.787.874 1.485 1.048 4.28.96 5.851 2.533 6.55 6.812.087.611-.088 1.572.96 1.397.786-.087.524-.96.612-1.397 0-4.105-3.58-7.86-7.86-8.384Z"
        fill="#fff"
      />
      <Path
        d="M26.817 15.824c-.436 0-.873.088-1.047.524-.262.699.261.873.785.96 1.747.263 2.708 1.31 2.882 3.057.087.437.35.873.786.786.611-.087.699-.611.699-1.222.087-1.922-2.183-4.192-4.105-4.105Z"
        fill="#fff"
      />
    </AccessibleSvg>
  )
}

export const ViberRound = styled(ViberRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
