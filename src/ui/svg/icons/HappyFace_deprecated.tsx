import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

import { IconInterface } from './types'

export function HappyFaceDeprecated({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
}: IconInterface) {
  return (
    <Svg width={size} height={size} viewBox="0 0 70 69" testID={testID} aria-hidden>
      <Path
        fill={color}
        fillRule="evenodd"
        d="M35 0c19.054 0 34.5 15.446 34.5 34.5a34.36 34.36 0 01-7.127 21.002 1.817 1.817 0 01-2.88-2.213A30.732 30.732 0 0065.868 34.5c0-17.048-13.82-30.868-30.868-30.868C17.95 3.632 4.132 17.45 4.132 34.5S17.95 65.368 35 65.368c4.18 0 8.246-.831 12.014-2.424a1.817 1.817 0 011.414 3.345A34.439 34.439 0 0135 69C15.945 69 .5 53.555.5 34.5S15.945 0 35 0z"
      />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M27.443 29.9a2.299 2.299 0 10-4.6 0c0 1.272 1.03 2.3 2.3 2.3 1.272 0 2.3-1.028 2.3-2.3m19.057 0a2.3 2.3 0 10-4.6 0 2.3 2.3 0 004.6 0m-27.054 8.328a1.799 1.799 0 012.591-.288c4.048 3.357 9.314 5.004 14.729 4.478a20.051 20.051 0 0010.56-4.245c.806-.639 1.964-.477 2.588.36.623.839.475 2.036-.33 2.675a23.648 23.648 0 01-12.447 5.01c-6.373.619-12.594-1.327-17.393-5.307a1.958 1.958 0 01-.298-2.683z"
      />
    </Svg>
  )
}
