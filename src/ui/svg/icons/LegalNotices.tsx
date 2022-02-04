import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const LegalNoticesSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      d="M8 6.5C8 5.39228 8.89228 4.5 10 4.5H38C39.1077 4.5 40 5.39228 40 6.5V29.59C40 30.1423 40.4477 30.59 41 30.59C41.5523 30.59 42 30.1423 42 29.59V6.5C42 4.28772 40.2123 2.5 38 2.5H10C7.78772 2.5 6 4.28772 6 6.5V42.5C6 44.7123 7.78772 46.5 10 46.5H38C40.2123 46.5 42 44.7123 42 42.5V38.46C42 37.9077 41.5523 37.46 41 37.46C40.4477 37.46 40 37.9077 40 38.46V42.5C40 43.6077 39.1077 44.5 38 44.5H10C8.89228 44.5 8 43.6077 8 42.5V6.5ZM14 11.5C13.4477 11.5 13 11.9477 13 12.5C13 13.0523 13.4477 13.5 14 13.5H34C34.5523 13.5 35 13.0523 35 12.5C35 11.9477 34.5523 11.5 34 11.5H14ZM13 20.5C13 19.9477 13.4477 19.5 14 19.5H34C34.5523 19.5 35 19.9477 35 20.5C35 21.0523 34.5523 21.5 34 21.5H14C13.4477 21.5 13 21.0523 13 20.5ZM14 27.5C13.4477 27.5 13 27.9477 13 28.5C13 29.0523 13.4477 29.5 14 29.5H28C28.5523 29.5 29 29.0523 29 28.5C29 27.9477 28.5523 27.5 28 27.5H14Z"
    />
  </Svg>
)

export const LegalNotices = styled(LegalNoticesSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
