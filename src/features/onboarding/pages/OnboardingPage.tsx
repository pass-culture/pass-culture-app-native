import React, { FunctionComponent, ReactNode } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export interface OnboardingPageProps {
  title: string
  subtitle?: string
  buttons?: Array<ReactNode>
}

const HEADER_HEIGHT = getSpacing(12)
export const OnboardingPage: FunctionComponent<OnboardingPageProps> = ({
  title,
  subtitle,
  buttons,
  children,
}) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton />
        </GoBackContainer>
      </HeaderContainer>
      <ScrollView>
        <Container>
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
            {title}
          </Typo.Title3>
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
        <ButtonsContainer>
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

const ButtonsContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: getSpacing(6),
  backgroundColor: theme.colors.white,
  alignItems: 'center',
}))
