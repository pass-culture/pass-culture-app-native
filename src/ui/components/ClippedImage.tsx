import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Defs, G, Image, Path, Use, LinearGradient, Stop } from 'react-native-svg'

import { ColorsEnum, getNativeShadow } from 'ui/theme'

export function ClippedImage(
  props: PropsWithChildren<{
    image?: string
    clipId: string
    path: string
    width?: number
    height?: number
  }>
) {
  const linearGradientId = props.clipId + '_linear'
  const pathId = props.clipId + '_path'

  return (
    <View
      style={{
        ...getNativeShadow({
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowRadius: 2,
          shadowColor: ColorsEnum.BLACK,
          shadowOpacity: 0.8,
        }),
      }}>
      <Svg
        width={props.width}
        height={props.height}
        viewBox={`0 0 ${props.width} ${props.height}`}
        {...props}>
        <Defs>
          <ClipPath id={props.clipId}>
            <Path d={props.path} />
          </ClipPath>
          <Path id={pathId} d={props.path} />
        </Defs>
        <LinearGradient x1="0" y1="1" x2="0" y2="0" id={linearGradientId}>
          <Stop offset="0" stopColor={ColorsEnum.GREY_MEDIUM} stopOpacity="1" />
          <Stop offset="1" stopColor={ColorsEnum.GREY_LIGHT} stopOpacity="1" />
        </LinearGradient>
        {props.image ? (
          <Image
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            href={{ uri: props.image }}
            clipPath={`url(#${props.clipId})`}
          />
        ) : (
          <G fill="none" fillRule="evenodd">
            <Use fill={`url(#${linearGradientId})`} xlinkHref={`#${pathId}`} />
          </G>
        )}
      </Svg>
    </View>
  )
}
