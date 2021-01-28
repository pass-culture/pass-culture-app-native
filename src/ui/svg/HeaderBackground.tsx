import * as React from 'react'
import { Dimensions } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path, G, Mask, Use } from 'react-native-svg'

import { getSpacing } from '../theme'

interface HeaderBackgroundProps {
  width?: number | string
}

export const HeaderBackground: React.FC<HeaderBackgroundProps> = (props): JSX.Element => {
  return (
    <Svg
      preserveAspectRatio="none"
      width={props.width || defaultWidth}
      height={getSpacing(70)}
      viewBox={`0 0 375 352`}>
      <Defs>
        <LinearGradient id="prefix__b" x1="34.782%" x2="88.023%" y1="5.945%" y2="111.119%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <LinearGradient id="prefix__c" x1="50%" x2="37.519%" y1="15.944%" y2="116.187%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <Path id="prefix__a" d="M0 0h375v352H0z" />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id="prefix__d" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Use fill="url(#prefix__b)" xlinkHref="#prefix__a" />
        <Path
          fill="url(#prefix__c)"
          d="M89.727-4.98c24.421 187.472 211.753 121.594 197.5 277.418-4.24 46.354-22.177 69.072-46.982 79.563L0 351.989V-5z"
          mask="url(#prefix__d)"
        />
      </G>
    </Svg>
  )
}

const defaultWidth = Dimensions.get('screen').width + getSpacing(1)
