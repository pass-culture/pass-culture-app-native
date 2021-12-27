import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const CloseDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <G>
            <Path
              d="M23.3 8.225c.302-.29.804-.301 1.12-.025.318.276.33.735.028 1.024l-5.322 5.11c-1.166 1.12-1.166 2.879 0 3.998l5.322 5.11c.302.29.29.749-.027 1.025-.317.276-.819.265-1.12-.025l-5.323-5.11c-1.749-1.68-1.749-4.318 0-5.997zm-14.6 0l5.322 5.11c1.749 1.679 1.749 4.318 0 5.997L8.7 24.442c-.302.29-.804.3-1.12.025-.318-.276-.33-.735-.028-1.025l5.322-5.11c1.166-1.12 1.166-2.878 0-3.998l-5.322-5.11c-.302-.29-.29-.748.027-1.024s.819-.265 1.12.025z"
              transform="translate(-322 -397) translate(0 376) matrix(-1 0 0 1 354 21) "
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)
