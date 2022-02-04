import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const ErrorSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      d="M24 5.40909C13.4545 5.40909 4.90909 13.9545 4.90909 24.5C4.90909 35.0455 13.4545 43.5909 24 43.5909C34.5455 43.5909 43.0909 35.0455 43.0909 24.5C43.0909 21.2082 42.2547 18.1094 40.7823 15.4009C40.5305 14.9377 40.7018 14.3582 41.165 14.1064C41.6282 13.8546 42.2078 14.0259 42.4595 14.4891C44.0798 17.4697 45 20.8809 45 24.5C45 36.0999 35.5999 45.5 24 45.5C12.4001 45.5 3 36.0999 3 24.5C3 12.9001 12.4001 3.5 24 3.5C27.5678 3.5 30.9396 4.38973 33.8828 5.97146C34.3471 6.22102 34.5213 6.79977 34.2717 7.26414C34.0222 7.72851 33.4434 7.90265 32.979 7.65309C30.3095 6.21845 27.2477 5.40909 24 5.40909ZM22.75 33.25C22.75 32.5596 23.3096 32 24 32C24.6904 32 25.25 32.5596 25.25 33.25C25.25 33.9404 24.6904 34.5 24 34.5C23.3096 34.5 22.75 33.9404 22.75 33.25ZM25 15.4512C25 14.9259 24.5523 14.5 24 14.5C23.4477 14.5 23 14.9259 23 15.4512V27.5488C23 28.0741 23.4477 28.5 24 28.5C24.5523 28.5 25 28.0741 25 27.5488V15.4512Z"
    />
  </Svg>
)

export const Error = styled(ErrorSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
