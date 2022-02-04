import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from '../types'

const FacebookSvg: React.FunctionComponent<IconInterface> = ({ size, color: _color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" testID={testID} aria-hidden>
    <G fill="none" fillRule="evenodd">
      <G fillRule="nonzero">
        <G>
          <Path
            fill="#1978F2"
            d="M12.006 0C7.034 0 5.58.005 5.296.029 4.277.114 3.642.276 2.95.623c-.533.267-.953.576-1.368 1.01C.825 2.423.367 3.396.2 4.552c-.08.561-.104.676-.108 3.542-.002.956 0 2.213 0 3.9 0 5.007.005 6.471.029 6.755.082 1.001.238 1.63.568 2.32.63 1.317 1.834 2.307 3.252 2.676.49.127 1.033.198 1.73.23.294.014 3.3.023 6.309.023 3.008 0 6.016-.004 6.304-.018.806-.039 1.274-.102 1.792-.237 1.427-.37 2.608-1.346 3.252-2.682.323-.672.487-1.326.561-2.274.016-.207.023-3.504.023-6.796 0-3.293-.007-6.583-.023-6.79-.076-.964-.24-1.612-.573-2.297-.274-.56-.578-.979-1.02-1.407-.788-.759-1.752-1.22-2.9-1.387-.556-.081-.667-.105-3.514-.11h-3.877z"
            transform="translate(-307 -868) translate(307.5 868)"
          />
          <Path
            fill="#FFF"
            d="M19.04 4.615h-3.111c-1.847 0-3.9.774-3.9 3.439.009.928 0 1.817 0 2.818H9.893v3.385h2.202V24h4.046v-9.808h2.67l.242-3.33h-2.982s.007-1.48 0-1.91c0-1.054 1.1-.993 1.167-.993h1.803V4.615h-.001z"
            transform="translate(-307 -868) translate(307.5 868)"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export const Facebook = styled(FacebookSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
