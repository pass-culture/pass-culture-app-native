import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const PhoneFilledSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      d="M35.4002 29.0089C33.4467 27.7767 30.8522 28.3678 29.62 30.3212L28.6984 31.7938C26.6648 30.6017 24.2305 28.8686 21.7261 26.3742C19.0013 23.6494 17.178 21.2652 15.9859 19.442L17.6789 18.3801C19.6324 17.148 20.2234 14.5634 18.9912 12.5999L16.6972 8.96352C15.465 7.00005 12.8805 6.40901 10.927 7.64118C7.00008 10.1155 5.81799 15.2947 8.29236 19.2116L8.45264 19.4721C9.39431 21.2352 11.9588 25.5027 17.2882 30.8221C23.2988 36.8327 27.947 39.3271 29.1892 39.9382C33.0561 42.092 37.9848 40.8798 40.369 37.0831C41.6011 35.1297 41.0101 32.5351 39.0567 31.3029L35.4002 29.0089Z"
    />
  </Svg>
)

export const PhoneFilled = styled(PhoneFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
