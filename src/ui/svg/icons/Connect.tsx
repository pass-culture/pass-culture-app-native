import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function ConnectSvg({
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
      <Path d="M45 13.5082C45 12.6752 44.3275 12 43.4979 12C42.6683 12 41.9958 12.6752 41.9958 13.5082V34.4918C41.9958 35.3248 42.6683 36 43.4979 36C44.3275 36 45 35.3248 45 34.4918V13.5082ZM28.1855 34.4918H23.0813C17.9434 34.4918 13.6881 30.5841 12.9774 25.5046C12.9429 25.507 12.908 25.5082 12.8729 25.5082H4.50208C3.6725 25.5082 3 24.833 3 24C3 23.1671 3.6725 22.4918 4.50208 22.4918H12.8729C12.908 22.4918 12.9429 22.4931 12.9774 22.4954C13.6881 17.4159 17.9434 13.5082 23.0813 13.5082H28.1855C28.747 13.5082 29.2063 13.9803 29.2063 14.5574V17.246H35.3106C36.1401 17.246 36.8126 17.9212 36.8126 18.7542C36.8126 19.5871 36.1401 20.2624 35.3106 20.2624H29.2063V27.7378H35.3106C36.1401 27.7378 36.8126 28.413 36.8126 29.246C36.8126 30.0789 36.1401 30.7542 35.3106 30.7542H29.2063V33.4426C29.2063 34.0197 28.7572 34.4918 28.1855 34.4918Z" />
    </AccessibleSvg>
  )
}

export const Connect = styled(ConnectSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
