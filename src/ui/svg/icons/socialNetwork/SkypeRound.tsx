import * as React from 'react'
import { Path, Defs, ClipPath, G, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const SkypeRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: clipPathId, fill: clipPathFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <G clipPath={clipPathFill}>
        <Path
          d="M47.986 0H.014A.014.014 0 0 0 0 .014v47.972c0 .008.006.014.014.014h47.972a.014.014 0 0 0 .014-.014V.014A.014.014 0 0 0 47.986 0Z"
          fill="#00AFF0"
        />
        <Path
          d="M11.014 21.691a13.145 13.145 0 0 0 3.629 11.652 13.12 13.12 0 0 0 11.642 3.632C34.648 41.045 40.48 32.06 36.95 26.3c1.764-10.138-7.52-16.897-15.27-15.284a7.821 7.821 0 0 0-9.389 1.28 7.836 7.836 0 0 0-1.278 9.396Zm18.493-3.226c1.228 1.767-1.227 3.15-2.148 2.074-1.228-1.382-2.456-2.074-3.76-1.997-3.377.23-3.3 3.072-.384 3.456 3.99.615 7.597 1.69 7.29 5.223-.384 3.994-3.607 5.146-6.906 4.916-3.99-.308-5.218-1.69-5.986-3.15-.92-1.766 1.689-3.456 2.763-1.535 1.765 2.841 4.988 2.457 5.985 1.305 1.535-1.766-.076-2.842-1.765-3.149-1.841-.384-3.76-.768-5.218-1.536-2.302-1.229-3.3-7.066 2.763-8.064 2.762-.461 6.062.384 7.366 2.457Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Rect width={48} height={48} rx={24} fill="#fff" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const SkypeRound = styled(SkypeRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
