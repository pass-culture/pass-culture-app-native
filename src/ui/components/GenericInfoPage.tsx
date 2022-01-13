import React, { ReactNode, useMemo, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
  header?: ReactNode
}

const ANIMATION_SIZE = getSpacing(45)
const ICON_SIZE = getSpacing(35)

export const GenericInfoPage: FunctionComponent<Props> = ({
  children,
  header,
  noIndex = true,
  animation,
  icon: Icon,
  title,
  flex = true,
  buttons,
}) => {
  const { isTouch } = useTheme()
  const Wrapper = useMemo(() => (flex ? Container : React.Fragment), [flex])
  return (
    <Wrapper>
      {!!noIndex && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <Background />
      {header}
      <Content>
        <Spacer.Column numberOfSpaces={spacingMatrix.top} />
        {!!isTouch && <Spacer.Flex flex={1} />}
        {Icon ? (
          <React.Fragment>
            <Icon color={ColorsEnum.WHITE} size={ICON_SIZE} />
            <Spacer.Column numberOfSpaces={spacingMatrix.afterIcon} />
          </React.Fragment>
        ) : (
          !!animation && (
            <React.Fragment>
              <StyledLottieView source={animation} autoPlay loop={false} size={ANIMATION_SIZE} />
              <Spacer.Column numberOfSpaces={spacingMatrix.afterLottieAnimation} />
            </React.Fragment>
          )
        )}
        <StyledTitle2>{title}</StyledTitle2>
        <Spacer.Column numberOfSpaces={spacingMatrix.afterTitle} />
        {children}
        {!!isTouch && <Spacer.Column numberOfSpaces={30} />}
        {!!buttons && (
          <BottomContainer>
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <Spacer.Column numberOfSpaces={4} />}
                {button}
              </React.Fragment>
            ))}
          </BottomContainer>
        )}
        <Spacer.BottomScreen />
      </Content>
    </Wrapper>
  )
}

const spacingMatrix = {
  top: 9,
  afterIcon: 9,
  afterLottieAnimation: 9,
  afterTitle: 5,
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const StyledLottieView = styled(LottieView)((props: { size: number }) => ({
  width: props.size,
  height: props.size,
}))

const StyledTitle2 = styled(Typo.Title2)(({ color, theme }) => ({
  color: color ?? theme.colors.white,
  textAlign: 'center',
}))

const Content = styled.View({
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
  maxWidth: getSpacing(90),
})

const BottomContainer = styled.View(({ theme }) => ({
  flex: 1,
  alignSelf: 'stretch',
  ...(theme.isTouch
    ? {
        justifyContent: 'flex-end',
        marginBottom: getSpacing(8),
      }
    : {
        marginTop: getSpacing(8),
        maxHeight: getSpacing(24),
      }),
}))
