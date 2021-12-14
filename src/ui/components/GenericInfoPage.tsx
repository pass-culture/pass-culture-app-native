import React, { useMemo, FunctionComponent } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { Helmet } from 'libs/react-helmet/Helmet'
import { AnimationObject } from 'ui/animations/type'
import { Background } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  noIndex?: boolean
  flex?: boolean
  animation?: AnimationObject
  animationSize?: number
  icon?: FunctionComponent<IconInterface>
  iconSize?: number
  title: string
  spacingMatrix?: Partial<SpacingMatrix>
}

export const GenericInfoPage: FunctionComponent<Props> = (props) => {
  const {
    noIndex = true,
    animation,
    animationSize = getSpacing(45),
    icon: Icon,
    iconSize = getSpacing(25),
    title,
    flex = true,
  } = props
  const spacingMatrix: SpacingMatrix = Object.assign(defaultSpacingMatrix, props.spacingMatrix)

  const Wrapper = useMemo(() => (flex ? Container : React.Fragment), [flex])
  return (
    <Wrapper>
      {!!noIndex && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <Background />
      <ScrollView bounces={false} contentContainerStyle={scrollViewContentContainerStyle}>
        <Spacer.Column numberOfSpaces={spacingMatrix.top} />
        {Icon ? (
          <React.Fragment>
            <Icon color={ColorsEnum.WHITE} size={iconSize} />
            <Spacer.Column numberOfSpaces={spacingMatrix.afterIcon} />
          </React.Fragment>
        ) : (
          !!animation && (
            <React.Fragment>
              <StyledLottieView source={animation} autoPlay loop={false} size={animationSize} />
              <Spacer.Column numberOfSpaces={spacingMatrix.afterLottieAnimation} />
            </React.Fragment>
          )
        )}
        <StyledTitle2>{title}</StyledTitle2>
        <Spacer.Column numberOfSpaces={spacingMatrix.afterTitle} />
        {props.children}
        <Spacer.BottomScreen />
      </ScrollView>
    </Wrapper>
  )
}

GenericInfoPage.defaultProps = {
  animationSize: getSpacing(45),
  iconSize: getSpacing(25),
  flex: true,
}

const defaultSpacingMatrix = {
  top: 18,
  afterIcon: 9,
  afterLottieAnimation: 9,
  afterTitle: 5,
}

type SpacingMatrix = typeof defaultSpacingMatrix

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const scrollViewContentContainerStyle: ViewStyle = {
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
  maxWidth: getSpacing(90),
}

const StyledLottieView = styled(LottieView)((props: { size: number }) => ({
  width: props.size,
  height: props.size,
}))

const StyledTitle2 = styled(Typo.Title2).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
