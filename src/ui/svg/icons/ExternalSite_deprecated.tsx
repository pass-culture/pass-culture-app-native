import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const ExternalSiteDeprecated: React.FunctionComponent<IconInterface & { inText?: boolean }> =
  ({ size = 32, color = ColorsEnum.BLACK, inText = false, testID }) => (
    <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
      <G fill="none" fillRule="evenodd" transform={inText ? 'translate(0 6)' : ''}>
        <G fill={color}>
          <G>
            <G>
              <Path
                d="M15.485 11c.384.005.576.207.576.606s-.192.6-.576.606H9.152v10.91h10.363v-6.667c0-.404.192-.607.576-.607.384 0 .576.203.576.607v7.272c0 .335-.258.606-.576.606H8.576c-.318 0-.576-.271-.576-.606v-12.12c0-.336.258-.607.576-.607h6.909zm3.983-4l.095.004 3.814.458c.27.032.484.256.515.539l.437 3.992c.037.336-.193.64-.514.678-.321.038-.612-.203-.648-.539l-.306-2.784-7.503 7.854c-.229.239-.6.239-.828 0-.228-.24-.228-.627 0-.866l7.459-7.808-2.56-.307c-.289-.035-.504-.284-.518-.579l.004-.1c.037-.335.327-.577.648-.538z"
                transform="translate(-38 -596) translate(21 592) translate(17 4)"
              />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  )
