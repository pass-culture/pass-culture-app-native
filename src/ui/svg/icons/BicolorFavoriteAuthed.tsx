import React, { memo } from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { svgIdentifier } from 'ui/svg/utils'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorFavoriteAuthed: React.FC<BicolorIconInterface> = ({
  size,
  color,
  color2,
  thin,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <Svg width={size} height={size} viewBox="0 0 27 22" testID={testID} aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        d="M21.701 11.23c.38 0 .688.307.688.687 0 .38-.308.687-.688.687-.308 0-.612.026-.91.078-2.535.436-4.414 2.644-4.414 5.245 0 .917-1.375.917-1.375 0 0-2.94-2.382-5.323-5.323-5.323-2.94 0-5.325 2.383-5.325 5.323 0 .632.11 1.248.318 1.817 1.946 5.012 5.898 9.018 10.855 11.024l.16.063.19-.076c.424-.175.83-.368 1.264-.601l.443-.247c.228-.13.465-.273.718-.43l.53-.333.579-.377c1.008-.664 1.697-1.201 2.47-1.926l.435-.418.494-.493.182-.187c.266-.271.7-.277.973-.012.271.266.277.701.011.973l-.537.543-.319.313-.299.284c-.832.78-1.582 1.366-2.654 2.071l-.643.418c-1.43.916-2.401 1.429-3.591 1.88-.122.045-.254.056-.38.03l-.095-.026-.052-.02c-5.5-2.099-9.883-6.462-12.02-11.968-.268-.732-.407-1.508-.407-2.302 0-3.7 3-6.698 6.7-6.698 2.59 0 4.836 1.47 5.95 3.62l.06.121.012-.023c.896-1.801 2.582-3.154 4.635-3.579l.221-.041c.376-.065.758-.098 1.144-.098z"
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke={gradientFill}
        strokeWidth={thin ? 0 : 0.3}
        transform="translate(-3 -11)"
      />
    </Svg>
  )
}

export const BicolorFavoriteAuthed = memo(
  styled(NotMemoizedBicolorFavoriteAuthed).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
