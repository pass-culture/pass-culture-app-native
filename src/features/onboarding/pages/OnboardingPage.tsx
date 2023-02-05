import React, { FunctionComponent, ReactNode } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { customEaseInOut, DURATION_IN_MS } from 'features/onboarding/helpers/animationProps'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export interface OnboardingPageProps {
  title?: string
  subtitle?: string
  buttons?: Array<ReactNode>
  onGoBack?: () => void
}

const buttonsContainerAnimation = {
  from: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
  },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
}

const HEADER_HEIGHT = getSpacing(12)
export const OnboardingPage: FunctionComponent<OnboardingPageProps> = ({
  title,
  subtitle,
  buttons,
  onGoBack,
  children,
}) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton onGoBack={onGoBack} />
        </GoBackContainer>
      </HeaderContainer>
      <ScrollView>
        <Container>
          {!!title && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
                {title}
              </Typo.Title3>
            </React.Fragment>
          )}
          {subtitle ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body numberOfLines={3}>{subtitle}</Typo.Body>
            </React.Fragment>
          ) : null}
          <Spacer.Column numberOfSpaces={4} />
          {children}
        </Container>
        {!buttons && <Spacer.Column numberOfSpaces={6} />}
      </ScrollView>
      {!!buttons && (
        <ButtonsContainer
          animation={buttonsContainerAnimation}
          duration={DURATION_IN_MS}
          delay={NAV_DELAY_IN_MS + 100} // We delay a little bit more for better animation orchestration
          easing={customEaseInOut}>
          {buttons?.map((button, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <Spacer.Column numberOfSpaces={4} />}
              {button}
            </React.Fragment>
          ))}
        </ButtonsContainer>
      )}
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const TopSpacer = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
}))

const GoBackContainer = styled.View({
  justifyContent: 'center',
  height: HEADER_HEIGHT,
  paddingHorizontal: getSpacing(3),
})

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const ButtonsContainer = styled(AnimatedView)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: getSpacing(6),
  backgroundColor: theme.colors.white,
}))
