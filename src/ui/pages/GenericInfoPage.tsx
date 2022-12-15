import React, { ReactNode, useMemo, FunctionComponent, useEffect } from 'react'
import { StatusBar } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { Helmet } from 'libs/react-helmet/Helmet'
import { AnimationObject } from 'ui/animations/type'
import { BackgroundWithDefaultStatusBar } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  noIndex?: boolean
  flex?: boolean
  animation?: AnimationObject
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
}

const ANIMATION_SIZE = getSpacing(45)

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK !!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION !
export const GenericInfoPage: FunctionComponent<Props> = ({
  children,
  noIndex = true,
  animation,
  icon: Icon,
  title,
  flex = true,
  buttons,
}) => {
  const { isTouch } = useTheme()
  const Wrapper = useMemo(() => (flex ? Container : React.Fragment), [flex])
  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.colors.white,
    }))({ width: '100%' })

  const getButtonSpaces = () => {
    if (buttons) {
      return buttons.length === 1
        ? spacingMatrix.bottomWithOneButton
        : spacingMatrix.bottomWithMoreThanOneButton
    }
    return spacingMatrix.bottom
  }

  useEffect(() => {
    setTimeout(() => {
      StatusBar.setBarStyle('light-content', true)
    })
    return () => StatusBar.setBarStyle('dark-content', true)
  }, [])

  return (
    <Wrapper>
      {!!noIndex && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <BackgroundWithDefaultStatusBar />
      <Content>
        <Spacer.TopScreen />
        {!!isTouch && (
          <React.Fragment>
            <Spacer.Flex />
            <Spacer.Column numberOfSpaces={spacingMatrix.top} />
          </React.Fragment>
        )}
        {StyledIcon ? (
          <React.Fragment>
            <StyledIcon />
            <Spacer.Column numberOfSpaces={spacingMatrix.afterIcon} />
          </React.Fragment>
        ) : (
          !!animation && (
            <React.Fragment>
              <StyledLottieView
                source={animation}
                autoPlay
                loop={false}
                size={ANIMATION_SIZE}
                progress={1}
              />
              <Spacer.Column numberOfSpaces={spacingMatrix.afterLottieAnimation} />
            </React.Fragment>
          )
        )}
        <StyledTitle>{title}</StyledTitle>
        <Spacer.Column numberOfSpaces={spacingMatrix.afterTitle} />
        {children}
        {!!isTouch && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={getButtonSpaces()} />
            <Spacer.Flex flex={0.5} />
          </React.Fragment>
        )}
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
  top: 10,
  afterIcon: 5,
  afterLottieAnimation: 5,
  afterTitle: 5,
  bottom: 10,
  bottomWithOneButton: 15,
  bottomWithMoreThanOneButton: 30,
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const StyledLottieView = styled(LottieView)((props: { size: number }) => ({
  width: props.size,
  height: props.size,
}))

const StyledTitle = styled(Typo.Title2).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const Content = styled.View({
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
  maxWidth: getSpacing(90),
  overflowY: 'auto',
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
