import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

import { IconInterface } from './types'

export function SadFaceDeprecated({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
}: IconInterface) {
  return (
    <Svg width={size} height={size} viewBox="0 0 105 105" testID={testID} aria-hidden>
      <Path
        d="M52.5 0C81.495 0 105 23.505 105 52.5c0 11.717-3.855 22.858-10.846 31.959-.93 1.21-2.665 1.437-3.875.508-1.21-.93-1.437-2.665-.508-3.875 6.257-8.143 9.703-18.103 9.703-28.592 0-25.943-21.031-46.974-46.974-46.974-25.945 0-46.974 21.03-46.974 46.974 0 25.944 21.029 46.974 46.974 46.974 6.362 0 12.548-1.266 18.282-3.69 1.406-.594 3.027.064 3.621 1.47.595 1.405-.063 3.026-1.469 3.62C66.522 103.584 59.604 105 52.5 105 23.503 105 0 81.496 0 52.5S23.503 0 52.5 0zm22.75 63.685c1.195 1.027 1.366 2.859.38 4.09-.985 1.232-2.753 1.397-3.95.37-6.07-5.215-14.037-7.861-22.29-7.205-5.978.476-11.556 2.639-16.181 6.178-1.243.951-3 .675-3.927-.617-.926-1.292-.67-3.11.573-4.06 5.464-4.182 12.042-6.733 19.072-7.292 9.712-.773 19.127 2.353 26.322 8.536zM37.5 42c1.935 0 3.5 1.568 3.5 3.5 0 1.935-1.565 3.5-3.5 3.5-1.932 0-3.5-1.565-3.5-3.5 0-1.932 1.568-3.5 3.5-3.5zm29 0c1.932 0 3.5 1.568 3.5 3.5 0 1.935-1.568 3.5-3.5 3.5-1.936 0-3.5-1.565-3.5-3.5 0-1.932 1.564-3.5 3.5-3.5z"
        transform="translate(-135 -137) translate(135 137)"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
