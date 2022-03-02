import React from 'react'
import { Platform } from 'react-native'
import Svg, { ClipPath, Defs, G, Path, Use, LinearGradient, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/react-native-svg/Image'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { IconInterface } from 'ui/svg/icons/types'
import { getShadow } from 'ui/theme'

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
      altIcon: React.FC<IconInterface>
    }
  | {
      image?: never
      altIcon?: never
    }
)

export function ClippedImage(props: ClippedImageProps) {
  const { colors } = useTheme()
  const linearGradientId = props.clipId + '_linear'
  const pathId = props.clipId + '_path'
  const Icon = props.altIcon || OfferDigital

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.standard,
    color: theme.colors.greyMedium,
  }))``

  return (
    <Container>
      <StyledSvg
        width={props.width}
        height={props.height}
        viewBox={`0 0 ${props.width} ${props.height}`}>
        <Defs>
          <ClipPath id={props.clipId}>
            <Path d={props.path} />
          </ClipPath>
          <Path id={pathId} d={props.path} />
        </Defs>
        <LinearGradient x1="0" y1="1" x2="0" y2="0" id={linearGradientId}>
          <Stop offset="0" stopColor={colors.greyMedium} stopOpacity="1" />
          <Stop offset="1" stopColor={colors.greyLight} stopOpacity="1" />
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
      </StyledSvg>
      {!props.image && Icon ? (
        <IconContainer testID="iconContainer">
          <StyledIcon />
        </IconContainer>
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  borderRadius: 4,
  ...Platform.select({
    default: getShadow({
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 2,
      shadowColor: theme.colors.black,
      shadowOpacity: 0.25,
    }),
    web: {},
  }),
}))

const StyledSvg =
  Platform.OS === 'web'
    ? styled(Svg)(({ theme }) => ({
        borderRadius: 4,
        ...getShadow(
          {
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowRadius: 2,
            shadowColor: theme.colors.black,
            shadowOpacity: 0.25,
          },
          true
        ),
      }))
    : Svg

const IconContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  height: '100%',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: theme.colors.greyLight,
  ...Platform.select({
    web: getShadow({
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 2,
      shadowColor: theme.colors.black,
      shadowOpacity: 0.25,
    }),
    default: {},
  }),
}))
