import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const CloseSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} aria-hidden>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.69372 4.79014C5.29264 4.38935 4.65806 4.40582 4.27634 4.82693C3.89461 5.24804 3.9103 5.91433 4.31138 6.31512L21.7973 23.7888C22.2038 24.195 22.2038 24.8261 21.7973 25.2322L21.7956 25.234L4.41496 42.6866C4.01481 43.0884 4.00066 43.7548 4.38335 44.1749C4.76604 44.5951 5.40066 44.6099 5.80081 44.2081L23.1797 26.7572L23.1806 26.7563C23.567 26.3699 23.8325 25.9068 23.9772 25.4149C24.1249 25.9053 24.393 26.3664 24.7818 26.7504L24.7828 26.7513L42.3093 44.1182C42.712 44.5172 43.3465 44.4979 43.7265 44.0751C44.1065 43.6523 44.0882 42.9861 43.6855 42.5871L26.1574 25.2187L26.1558 25.2171C25.7441 24.8109 25.7444 24.173 26.1499 23.7678L43.6713 6.32038C44.0724 5.91959 44.0881 5.2533 43.7064 4.83219C43.3247 4.41108 42.6901 4.39461 42.289 4.7954L24.7676 22.2428C24.3814 22.6287 24.1157 23.0924 23.971 23.5854C23.8249 23.1009 23.5611 22.645 23.1797 22.2638L5.69372 4.79014Z"
    />
  </Svg>
)

export const Close = styled(CloseSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
