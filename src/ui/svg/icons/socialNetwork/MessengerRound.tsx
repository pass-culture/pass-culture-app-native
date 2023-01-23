import * as React from 'react'
import { Path, Defs, Rect, RadialGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const MessengerRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Rect width={48} height={48} rx={24} fill={gradientFill} />
      <Path
        d="M24 10c-7.886 0-14 5.778-14 13.58 0 4.08 1.673 7.608 4.396 10.044.227.203.367.49.374.798l.078 2.492a1.12 1.12 0 0 0 1.571.99l2.779-1.224c.235-.105.5-.123.749-.056 1.277.35 2.636.539 4.053.539 7.886 0 14-5.779 14-13.58S31.886 10 24 10Z"
        fill="#fff"
      />
      <Path
        d="m15.593 27.552 4.113-6.524a2.1 2.1 0 0 1 3.038-.56l3.272 2.454a.84.84 0 0 0 1.012-.004l4.417-3.353c.587-.448 1.358.26.965.886l-4.115 6.52a2.1 2.1 0 0 1-3.039.56l-3.272-2.453a.84.84 0 0 0-1.012.003l-4.417 3.353c-.588.448-1.357-.256-.962-.882Z"
        fill={gradientFill2}
      />
      <Defs>
        <RadialGradient
          id={gradientId}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(52.8 0 0 52.7986 8.04 47.999)">
          <Stop stopColor="#09F" />
          <Stop offset={0.6} stopColor="#A033FF" />
          <Stop offset={0.9} stopColor="#FF5280" />
          <Stop offset={1} stopColor="#FF7061" />
        </RadialGradient>
        <RadialGradient
          id={gradientId2}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(30.8 0 0 30.7992 14.69 38)">
          <Stop stopColor="#09F" />
          <Stop offset={0.6} stopColor="#A033FF" />
          <Stop offset={0.9} stopColor="#FF5280" />
          <Stop offset={1} stopColor="#FF7061" />
        </RadialGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const MessengerRound = styled(MessengerRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
