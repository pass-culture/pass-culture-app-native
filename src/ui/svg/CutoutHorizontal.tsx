import * as React from 'react'
import { Defs, Rect, Path, G, Mask } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

type Props = AccessibleIcon & {
  orientation: 'left' | 'right'
  backgroundColor?: string
}

export const CutoutHorizontal: React.FC<Props> = ({
  accessibilityLabel,
  testID,
  backgroundColor,
  color,
  orientation,
}) => {
  const { designSystem } = useTheme()
  const fillColor = backgroundColor ?? designSystem.color.background.default
  const strokeColor = color ?? designSystem.color.background.subtle

  const rotate = orientation === 'right' ? '180deg' : '0deg'
  const { id: maskId, fill: maskRef } = svgIdentifier()

  return (
    <AccessibleSvg
      width={20}
      height={40}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={{ transform: [{ rotate }] }}>
      <Defs>
        <Mask id={maskId}>
          <Rect x="0" y="0" width="20" height="40" fill="white" />
          <Path
            d="M0 39.5C5.17172 39.5 10.1316 37.4455 13.7886 33.7886C17.4455 30.1316 19.5 25.1717 19.5 20C19.5 14.8283 17.4455 9.86838 13.7886 6.21142C10.1316 2.55446 5.17172 0.5 0 0.5"
            fill="black"
          />
        </Mask>
      </Defs>

      <G mask={maskRef}>
        <Rect x="0" y="0" width="20" height="40" fill={fillColor} />
      </G>

      <Path
        d="M0 39.5C5.17172 39.5 10.1316 37.4455 13.7886 33.7886C17.4455 30.1316 19.5 25.1717 19.5 20C19.5 14.8283 17.4455 9.86838 13.7886 6.21142C10.1316 2.55446 5.17172 0.5 0 0.5"
        stroke={strokeColor}
        strokeWidth={1}
        fill="none"
      />
    </AccessibleSvg>
  )
}
