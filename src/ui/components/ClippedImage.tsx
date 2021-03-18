import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Defs, Image, Path } from 'react-native-svg'

import { ColorsEnum, getNativeShadow } from 'ui/theme'

export function ClippedImage(
  props: PropsWithChildren<{
    image: string
    clipId: string
    path: string
    width?: number
    height?: number
  }>
) {
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
        </Defs>
        <Image
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={{ uri: props.image }}
          clipPath={`url(#${props.clipId})`}
        />
      </Svg>
    </View>
  )
}
