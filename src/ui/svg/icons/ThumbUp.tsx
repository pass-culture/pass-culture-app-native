import * as React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function ThumbUpSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon) {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 76 76"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G fill="none" fillRule="evenodd">
        <G fill={color}>
          <G>
            <Path
              d="M44.148 18.358c1.824 1.1 2.93 3.072 2.934 5.128l-.01.343v.678c.008 3.116-.768 6.178-2.245 8.904l-.221.392 7.251.001c1.823.029 3.536.855 4.692 2.25l.224.286c1.08 1.469 1.458 3.332 1.047 5.097l-.093.351-3.594 12.16c-.753 2.542-3.03 4.314-5.652 4.438l-.316.007H36.32c-.986-.001-1.957-.236-2.834-.684-.584-.298-.816-1.013-.518-1.597.274-.536.897-.775 1.45-.582l.148.064c.453.232.947.371 1.452.412l.304.012h11.847c1.607.006 3.036-.99 3.597-2.476l.09-.267 3.593-12.16c.34-1.153.123-2.4-.59-3.368-.653-.888-1.652-1.45-2.726-1.552l-.295-.016h-8.006c-.705.003-1.355-.378-1.697-.993-.342-.616-.322-1.37.054-1.969 1.543-2.441 2.404-5.248 2.5-8.13l.008-.577.002-.748c.078-1.366-.606-2.663-1.778-3.37-1.172-.706-2.638-.706-3.81 0-1.171.707-1.856 2.004-1.78 3.527-.4 5.266-3.088 10.092-7.355 13.204-.139.1-.291.167-.448.201.053.27.08.549.08.834v15.834c0 2.404-1.95 4.354-4.354 4.354h-1.583c-2.405 0-4.354-1.95-4.354-4.354V38.158c0-2.404 1.95-4.354 4.354-4.354h1.583c1.293 0 2.454.563 3.251 1.458l.071-.058c3.705-2.702 6.04-6.892 6.386-11.307-.128-2.246.997-4.377 2.923-5.539 1.926-1.161 4.337-1.161 6.263 0zM25.254 36.18h-1.583c-1.093 0-1.98.886-1.98 1.98v15.833c0 1.093.887 1.979 1.98 1.979h1.583c1.093 0 1.98-.886 1.98-1.98V38.159c0-1.093-.887-1.979-1.98-1.979z"
              transform="translate(-39 -130) translate(39 130)"
            />
          </G>
        </G>
      </G>
    </AccessibleSvg>
  )
}

export const ThumbUp = styled(ThumbUpSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
