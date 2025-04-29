import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { customEaseInOut, DURATION_IN_MS } from 'features/onboarding/helpers/animationProps'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { EmptyHeader } from 'ui/components/headers/EmptyHeader'
import { Page } from 'ui/pages/Page'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  title?: string
  subtitle?: string
  buttons?: Array<ReactNode>
  onGoBack?: () => void
  children?: React.ReactNode
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

export const TutorialPage: FunctionComponent<Props> = ({
  title,
  subtitle,
  buttons,
  onGoBack,
  children,
}) => {
  return (
    <Page>
      <EmptyHeader onGoBack={onGoBack} />
      <StyledScrollView>
        <Container>
          {title ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
                {title}
              </Typo.Title3>
            </React.Fragment>
          ) : null}
          {subtitle ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{subtitle}</Typo.Body>
            </React.Fragment>
          ) : null}
          <Spacer.Column numberOfSpaces={4} />
          {children}
        </Container>
        {buttons ? null : <Spacer.Column numberOfSpaces={6} />}
      </StyledScrollView>
      {buttons ? (
        <ButtonsContainer
          animation={buttonsContainerAnimation}
          duration={DURATION_IN_MS}
          delay={NAV_DELAY_IN_MS + 100} // We delay a little bit more for better animation orchestration
          easing={customEaseInOut}>
          {buttons?.map((button, index) => (
            <React.Fragment key={'button' + index}>
              {index === 0 ? null : <Spacer.Column numberOfSpaces={4} />}
              {button}
            </React.Fragment>
          ))}
        </ButtonsContainer>
      ) : null}
      <Spacer.BottomScreen />
    </Page>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const ButtonsContainer = styled(AnimatedView)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: getSpacing(6),
  backgroundColor: theme.designSystem.color.background.default,
}))
