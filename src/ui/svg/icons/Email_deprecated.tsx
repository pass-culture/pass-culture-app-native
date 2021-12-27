import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const EmailDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 28,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <Path
            d="M21.438 7.583c.852 0 1.55.666 1.6 1.507l.004.097v10.5c0 .886-.719 1.604-1.604 1.604-.242 0-.438-.195-.438-.437 0-.222.165-.405.378-.434l.06-.004c.377 0 .688-.287.725-.654l.004-.075v-10.5c0-.377-.287-.688-.655-.725l-.074-.004h-14c-.378 0-.688.287-.726.655l-.004.074v10.5c0 .378.287.688.655.726l.075.003h10.227c.241 0 .437.196.437.438 0 .221-.164.404-.378.433l-.06.004H7.439c-.854 0-1.551-.666-1.602-1.506l-.003-.098v-10.5c0-.853.666-1.55 1.507-1.601l.098-.003h14zm-.694 2.565c.134.174.117.417-.03.57l-.049.044-4.878 3.764c-.778.6-1.81.632-2.616.092l-.104-.073-5.03-3.78c-.192-.145-.231-.42-.086-.612.132-.176.37-.224.558-.122l.054.035 5.03 3.78c.474.355 1.082.372 1.57.051l.089-.064 4.878-3.764c.192-.148.466-.112.614.08z"
            transform="translate(-92 -532) translate(92 532)"
          />
        </G>
      </G>
    </G>
  </Svg>
)
