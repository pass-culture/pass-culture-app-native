import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'
export const Info = ({ color = ColorsEnum.GREY_DARK, size = 32, testID }: IconInterface) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
      <G fill="none" fillRule="evenodd">
        <G fill={color} fillRule="nonzero">
          <G>
            <Path
              d="M16 6c5.523 0 10 4.477 10 10 0 2.232-.734 4.354-2.066 6.087-.171.223-.49.265-.713.094-.223-.171-.264-.49-.093-.713 1.196-1.558 1.855-3.462 1.855-5.468 0-4.962-4.022-8.983-8.983-8.983-4.962 0-8.983 4.021-8.983 8.983 0 4.961 4.022 8.983 8.983 8.983 1.217 0 2.4-.242 3.496-.706.259-.11.557.011.666.27.11.258-.01.557-.27.666-1.22.517-2.538.787-3.892.787-5.523 0-10-4.477-10-10 0-5.524 4.476-10 10-10zm0 5.038c.257 0 .47.191.504.44l.004.069v6.034c0 .281-.227.509-.508.509-.258 0-.47-.192-.504-.44l-.005-.069v-6.034c0-.281.228-.509.509-.509zm.678 9.327c0-.375-.303-.678-.678-.678-.375 0-.678.303-.678.678 0 .374.303.678.678.678.375 0 .678-.304.678-.678"
              transform="translate(-34 -112) translate(34 112)"
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}
