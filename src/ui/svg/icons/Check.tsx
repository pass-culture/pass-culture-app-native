import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const CheckSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      d="M43.7219 12.195C44.104 11.7963 44.0906 11.1633 43.6919 10.7811C43.2932 10.399 42.6602 10.4124 42.278 10.8111L39.718 13.4819C39.7154 13.4847 39.7127 13.4875 39.7101 13.4903L17.938 36.1997C17.552 36.6025 16.9395 36.6028 16.5531 36.2009L16.552 36.1997L5.7245 24.8188C5.34383 24.4187 4.71086 24.4029 4.31073 24.7836C3.9106 25.1643 3.89483 25.7973 4.2755 26.1974L15.1055 37.5809L15.108 37.5835C16.2816 38.8082 18.2083 38.8081 19.382 37.5835L41.1618 14.866C41.1646 14.8632 41.1673 14.8603 41.17 14.8574L43.7219 12.195Z"
    />
  </Svg>
)

export const Check = styled(CheckSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
