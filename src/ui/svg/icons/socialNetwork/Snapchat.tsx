import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from '../types'

const SnapchatSvg: React.FunctionComponent<IconInterface> = ({ size, color: _color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" testID={testID} aria-hidden>
    <G fill="none" fillRule="evenodd">
      <G fillRule="nonzero">
        <G>
          <Path
            fill="#EEE312"
            d="M24 18.537C24 21.554 21.563 24 18.557 24H5.443C2.437 24 0 21.554 0 18.537V5.463C0 2.446 2.437 0 5.443 0h13.114C21.563 0 24 2.446 24 5.463v13.074z"
            transform="translate(-219 -868) translate(219 868)"
          />
          <Path
            fill="#FFF"
            stroke="#1A1A1A"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.897 20.308c1.651 0 2.887-1.213 2.887-1.213.109-.09.232-.177.232-.177.989-.648 2.592-.18 2.592-.18.582.137.599-.302.599-.302l.045-.497c.042-.488.794-.482.794-.482.99-.039 1.406-.443 1.577-.728.184-.273-.164-.35-.164-.35-2.387-.665-3.545-2.925-3.545-2.925-.54-.944.2-1.325.2-1.325.2-.14 1.178-.462 1.178-.462.807-.323.539-.884.539-.884-.3-.603-.999-.2-.999-.2-.33.174-.579.16-.579.16-.552.01-.618-.108-.618-.108l.019-2.614c0-2.39-2.115-4.329-4.724-4.329h-.045c-2.609 0-4.723 1.938-4.723 4.329l.019 2.614s-.067.118-.619.108c0 0-.249.014-.58-.16 0 0-.698-.403-.998.2 0 0-.268.56.54.884 0 0 .978.321 1.178.462 0 0 .739.381.2 1.325 0 0-1.158 2.26-3.546 2.924 0 0-.348.078-.164.351.172.285.589.689 1.578.728 0 0 .751-.006.794.482l.045.497s.016.439.599.301c0 0 1.602-.467 2.591.18 0 0 .124.088.232.178 0 0 1.236 1.213 2.888 1.213h-.022z"
            transform="translate(-219 -868) translate(219 868)"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export const Snapchat = styled(SnapchatSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
