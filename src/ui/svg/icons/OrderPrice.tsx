import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const OrderPrice: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} testID={testID} viewBox="0 0 52 52">
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <Path d="M15.363 9.54l.056.085 1.394 2.412 11.695 1.217c.205.021.39.126.515.287l.057.084 7.73 13.41c.758 1.314.308 2.994-1.004 3.754-.359.208-.817.085-1.025-.273-.19-.329-.103-.742.188-.968l.085-.057c.557-.323.772-1.01.518-1.585l-.062-.121-7.539-13.08-10.232-1.065 1.55 2.685c.022.037.04.076.055.115.24-.078.498-.12.766-.12 1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5c0-.587.202-1.127.541-1.553-.037-.03-.072-.067-.104-.107l-.056-.085-1.399-2.42-3.962 8.92 7.539 13.05c.323.556 1.01.77 1.586.516l.122-.061 7.75-4.45c.359-.207.817-.083 1.023.277.19.329.101.741-.192.967l-.085.056-7.748 4.45c-1.262.727-2.86.342-3.659-.851l-.095-.154-7.73-13.38c-.1-.173-.126-.377-.076-.567l.04-.112 4.56-10.267-1.544-2.674c-.208-.359-.085-.817.274-1.024.329-.19.742-.103.968.19zm4.747 8.28c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" />
      </G>
    </G>
  </Svg>
)
