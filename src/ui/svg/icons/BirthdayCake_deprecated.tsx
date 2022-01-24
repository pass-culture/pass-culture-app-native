import * as React from 'react'
import Svg, { Rect, G, Path } from 'react-native-svg'

import { RectangleIconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const BirthdayCakeDeprecated: React.FunctionComponent<RectangleIconInterface> = ({
  width = 281,
  height = 176,
  testID,
}) => (
  <Svg width={width} height={height} testID={testID}>
    <G transform="translate(-26 -59)" fill="none" fillRule="evenodd">
      <G stroke={ColorsEnum.PRIMARY} strokeWidth={4} transform="translate(26.002 59)">
        <Path
          strokeLinecap="round"
          d="M156.635 149H98.49c-5.239 0-9.49-4.263-9.49-9.515v-20.97c0-5.257 4.251-9.515 9.49-9.515h81.02c5.243 0 9.49 4.258 9.49 9.515v20.97c0 5.252-4.247 9.515-9.49 9.515m-11.929-41H112.85c-5.328 0-9.634-4.29-9.634-9.575v-10.85c0-5.285 4.306-9.575 9.634-9.575h54.731c5.323 0 9.635 4.29 9.635 9.575v10.85c0 5.285-4.312 9.575-9.635 9.575z"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M146.216 44.767c0 3.444-2.685 6.233-6 6.233-3.316 0-6-2.79-6-6.233l6-15.767 6 15.767z"
        />
        <Path strokeLinecap="round" d="M105 92l24 .25m-40 35h26m31-35h-4m-9 35h-4m24 0h-4" />
        <Rect width={12} height={20} x={134.216} y={57} rx={2} />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M140.216 57v-6" />
        <Path strokeLinecap="round" d="M59 149h94m24 0h24m10 0h10" />
      </G>
    </G>
  </Svg>
)
