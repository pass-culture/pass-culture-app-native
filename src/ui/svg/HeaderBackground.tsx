import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G, Mask, Use } from 'react-native-svg'
import { useTheme } from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { getSpacing } from '../theme'

interface Props {
  height?: number
}

const NotMemoizedHeaderBackground: React.FC<Props> = (props) => {
  const width = useTheme().appContentWidth + getSpacing(1)
  const height = props.height || getSpacing(73.5)
  const LINEAR_GRADIENT_1_ID = uuidv1()
  const LINEAR_GRADIENT_2_ID = uuidv1()
  const PATH_ID = uuidv1()
  const MASK_ID = uuidv1()
  return (
    <Svg preserveAspectRatio="none" height={height} width={width} viewBox={`0 0 375 352`}>
      <Defs>
        <LinearGradient
          id={LINEAR_GRADIENT_1_ID}
          x1="34.782%"
          x2="88.023%"
          y1="5.945%"
          y2="111.119%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <LinearGradient id={LINEAR_GRADIENT_2_ID} x1="50%" x2="37.519%" y1="15.944%" y2="116.187%">
          <Stop offset="0%" stopColor="#EB0055" />
          <Stop offset="100%" stopColor="#320096" />
        </LinearGradient>
        <Path id={PATH_ID} d="M0 0h375v352H0z" />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id={MASK_ID} fill="#fff">
          <Use xlinkHref={`#${PATH_ID}`} />
        </Mask>
        <Use fill={`url(#${LINEAR_GRADIENT_1_ID})`} xlinkHref={`#${PATH_ID}`} />
        <Path
          fill={`url(#${LINEAR_GRADIENT_2_ID})`}
          d="M89.727-4.98c24.421 187.472 211.753 121.594 197.5 277.418-4.24 46.354-22.177 69.072-46.982 79.563L0 351.989V-5z"
          mask={`url(#${MASK_ID})`}
        />
      </G>
    </Svg>
  )
}

export const HeaderBackground = React.memo(NotMemoizedHeaderBackground)
