import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { RectangleIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export const ExternalLinkSite: React.FunctionComponent<
  RectangleIconInterface & { inText?: boolean }
> = ({ width = 15, height = 16, color = ColorsEnum.BLACK, testID }) => (
  <Svg width={width} height={height} testID={testID}>
    <Path
      d="M6.55 3.625c.335.005.503.181.503.53 0 .35-.168.526-.504.53H1.008v9.546h9.068V8.398c0-.354.168-.53.504-.53.335 0 .503.176.503.53v6.363c0 .293-.225.53-.503.53H.504a.518.518 0 01-.504-.53V4.155c0-.293.226-.53.504-.53h6.045zM10.024.126l.092.003 3.338.4a.524.524 0 01.45.472l.383 3.493a.53.53 0 01-.45.593.517.517 0 01-.567-.471l-.268-2.436-6.565 6.872a.496.496 0 01-.724 0 .554.554 0 010-.758l6.526-6.832L10 1.193a.526.526 0 01-.452-.496L9.55.6a.518.518 0 01.567-.471z"
      fill={color}
      fillRule="evenodd"
    />
  </Svg>
)
