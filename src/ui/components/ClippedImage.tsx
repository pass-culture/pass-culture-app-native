import React, { FC, PropsWithChildren } from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Defs, G, Image, Path, Use, LinearGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getNativeShadow } from 'ui/theme'

export type ClippedImageProps = {
  clipId: string
  path: string
  width?: number
  height?: number
} & (
  | {
      image: string
      altIcon?: never
    }
  | {
      image?: never
      altIcon: FC<IconInterface>
    }
  | {
      image?: never
      altIcon?: never
    }
)

export function ClippedImage(props: PropsWithChildren<ClippedImageProps>) {
  const linearGradientId = props.clipId + '_linear'
  const pathId = props.clipId + '_path'
  const Icon = props.altIcon || OfferDigital

  return (
    <View style={shaddowStyle}>
      <Svg width={props.width} height={props.height} viewBox={`0 0 ${props.width} ${props.height}`}>
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
      {!props.image && Icon && (
        <IconContainer>
          <Icon size={48} color={ColorsEnum.GREY_MEDIUM} />
        </IconContainer>
      )}
    </View>
  )
}

const shaddowStyle = {
  ...getNativeShadow({
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.1,
  }),
}

const IconContainer = styled.View({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  height: '100%',
})
