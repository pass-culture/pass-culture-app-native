import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const ClockFilledSvg: React.FunctionComponent<IconInterface> = ({
  size,
  testID,
  color,
}: IconInterface) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" testID={testID} aria-hidden>
    <Path
      fillRule={'evenodd'}
      clipRule={'evenodd'}
      d={
        'M8.99996 17.3333C13.6023 17.3333 17.3333 13.6024 17.3333 9C17.3333 4.39763 13.6023 0.666668 8.99996 0.666668C4.39759 0.666668 0.666626 4.39763 0.666626 9C0.666626 13.6024 4.39759 17.3333 8.99996 17.3333ZM8.99994 3.08183C9.44972 3.08183 9.81433 3.44645 9.81433 3.89622V8.66268L11.9622 10.8105C12.2802 11.1286 12.2802 11.6442 11.9622 11.9622C11.6441 12.2803 11.1285 12.2803 10.8104 11.9622L8.42408 9.57587C8.27135 9.42315 8.18555 9.216 8.18555 9.00001V3.89622C8.18555 3.44645 8.55016 3.08183 8.99994 3.08183Z'
      }
      fill={color}
    />
  </Svg>
)

export const ClockFilled = styled(ClockFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
