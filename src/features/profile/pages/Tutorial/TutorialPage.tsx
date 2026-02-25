import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { customEaseInOut, DURATION_IN_MS } from 'features/onboarding/helpers/animationProps'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { EmptyHeader } from 'ui/components/headers/EmptyHeader'
import { Page } from 'ui/pages/Page'
import { Spacer, Typo } from 'ui/theme'
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
        <Container buttons={buttons}>
          {title ? (
            <TitleContainer>
              <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
                {title}
              </Typo.Title3>
            </TitleContainer>
          ) : null}
          {subtitle ? (
            <SubtitleContainer>
              <Typo.Body>{subtitle}</Typo.Body>
            </SubtitleContainer>
          ) : null}
          <ChildrenContainer>{children}</ChildrenContainer>
        </Container>
      </StyledScrollView>
      {buttons ? (
        <ButtonsContainer
          animation={buttonsContainerAnimation}
          duration={DURATION_IN_MS}
          delay={NAV_DELAY_IN_MS + 100} // We delay a little bit more for better animation orchestration
          easing={customEaseInOut}>
          {buttons?.map((button, index) => (
            <ButtonContainer key={'button' + index} index={index}>
              {button}
            </ButtonContainer>
          ))}
        </ButtonsContainer>
      ) : null}
      <Spacer.BottomScreen />
    </Page>
  )
}
const ChildrenContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const ButtonContainer = styled.View<{ index: number }>(({ index, theme }) => ({
  marginTop: index === 0 ? 0 : theme.designSystem.size.spacing.l,
}))

const TitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
const SubtitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Container = styled.View<{ buttons?: Array<ReactNode> }>(({ theme, buttons }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: buttons ? 0 : theme.designSystem.size.spacing.xl,
}))

const ButtonsContainer = styled(AnimatedView)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.designSystem.size.spacing.xl,
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
}))
