import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const Clock: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID}>
    <G fill="none" fill-rule="evenodd">
      <G fill={color}>
        <G>
          <Path
            d="M24.75 10c8.147 0 14.75 6.604 14.75 14.75 0 3.292-1.083 6.423-3.047 8.98-.252.328-.723.39-1.052.137-.328-.252-.39-.723-.137-1.051C37.028 30.518 38 27.709 38 24.75c0-7.318-5.931-13.25-13.25-13.25-7.318 0-13.25 5.932-13.25 13.25C11.5 32.07 17.432 38 24.75 38c1.795 0 3.54-.357 5.157-1.041.381-.162.822.017.983.398.162.382-.017.822-.398.983-1.801.762-3.745 1.16-5.742 1.16C16.604 39.5 10 32.898 10 24.75S16.603 10 24.75 10zm-1 5.184c.38 0 .694.283.744.649l.006.101v9.854h9.005c.38 0 .694.283.743.649l.007.101c0 .38-.282.694-.648.744l-.102.006H23.75c-.38 0-.693-.282-.743-.648L23 26.538V15.934c0-.414.336-.75.75-.75z"
            transform="translate(-38 -96) translate(38 96)"
          />
        </G>
      </G>
    </G>
  </Svg>
)
