import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const DiagramSvg = ({ color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 24 24">
      <Path
        d="M10.2432 3.38574C10.3648 3.38583 10.4816 3.43429 10.5674 3.52051C10.6531 3.60668 10.7016 3.7232 10.7012 3.84473L10.667 11.3125H18.1348C18.3875 11.3126 18.5928 11.5177 18.5928 11.7705C18.5928 16.3733 14.8098 20.1553 10.207 20.1553C5.60433 20.1551 1.82228 16.3732 1.82227 11.7705C1.82227 7.16777 5.60432 3.38587 10.207 3.38574H10.2432ZM9.7832 4.31348C5.88002 4.53652 2.7373 7.81564 2.7373 11.7705C2.73732 15.8676 6.10998 19.2401 10.207 19.2402C14.1505 19.2402 17.4231 16.116 17.6631 12.2285H10.207C10.0854 12.2285 9.96865 12.1799 9.88281 12.0938C9.79694 12.0075 9.74851 11.8903 9.74902 11.7686L9.7832 4.31348ZM13.1104 1.82227C16.971 1.82236 20.1505 4.99189 20.1553 8.85352C20.1556 9.10617 19.9509 9.31101 19.6982 9.31152L13.1113 9.3252C12.9898 9.32544 12.8731 9.2772 12.7871 9.19141C12.7011 9.10553 12.6523 8.98876 12.6523 8.86719V2.28027C12.6523 2.02745 12.8575 1.82227 13.1104 1.82227ZM13.5684 8.40918L19.2217 8.39746C18.9919 5.40329 16.5639 2.98094 13.5684 2.75488V8.40918Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const Diagram = styled(DiagramSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.designSystem.size.icon.l,
}))``
