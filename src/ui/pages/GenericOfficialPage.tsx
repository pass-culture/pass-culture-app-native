import React, { ReactNode } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { Page } from 'ui/pages/Page'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  noIndex?: boolean
  flex?: boolean
  title: string
  buttons?: Array<ReactNode>
  children: React.ReactNode
}

export function GenericOfficialPage({
  children,
  noIndex = true,
  title,
  flex = true,
  buttons,
}: Readonly<Props>) {
  const { isTouch, designSystem } = useTheme()

  const getButtonSpaces = () => {
    if (buttons) {
      return buttons.length === 1 ? designSystem.size.spacing.l : designSystem.size.spacing.xxl
    }
    return designSystem.size.spacing.m
  }

  const pageContent = (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <IllustrationsContainer>
          <LogoFrenchRepublicContainer>
            <LogoFrenchRepublic />
          </LogoFrenchRepublicContainer>
          <LogoPassCultureContainer>
            <ColoredPassCultureLogo />
          </LogoPassCultureContainer>
        </IllustrationsContainer>
        <EmptyContainer />
      </HeaderContainer>
      <Content>
        {isTouch ? (
          <TopTouch>
            <Spacer.Flex />
          </TopTouch>
        ) : null}
        <TitleContainer>
          <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
        </TitleContainer>
        {children}
        {isTouch ? (
          <BottomTouch marginTop={getButtonSpaces()}>
            <Spacer.Flex flex={0.5} />
          </BottomTouch>
        ) : null}
      </Content>
      <BottomContent>
        {buttons ? (
          <BottomContainer>
            {buttons.map((button, index) => (
              <ButtonContainer key={(button as React.ReactElement).key} index={index}>
                {button}
              </ButtonContainer>
            ))}
          </BottomContainer>
        ) : null}
        <Spacer.BottomScreen />
      </BottomContent>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      {noIndex ? (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      ) : null}
      <Page>{flex ? <Container>{pageContent}</Container> : pageContent}</Page>
    </React.Fragment>
  )
}
const ButtonContainer = styled.View<{ index: number }>(({ theme, index }) => ({
  marginTop: index === 0 ? 0 : theme.designSystem.size.spacing.l,
}))
const TopTouch = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxxl,
}))

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
const BottomTouch = styled.View<{ marginTop: number }>(({ marginTop }) => ({
  marginTop,
}))

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  overflowY: 'auto',
})

const Content = styled.View(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  flexShrink: theme.isNative ? 1 : 0,
  flexBasis: 'auto',
  justifyContent: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
  maxWidth: getSpacing(100),
}))

const BottomContent = styled.View(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  flexBasis: 'auto',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
  maxWidth: getSpacing(100),
}))

const HeaderContainer = styled.View(({ theme }) => ({
  maxWidth: getSpacing(100),
  width: '100%',
  paddingTop: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const IllustrationsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignSelf: 'stretch',
})

const LogoFrenchRepublicContainer = styled.View({
  width: getSpacing(33),
  height: getSpacing(22),
})

const LogoPassCultureContainer = styled.View({
  justifyContent: 'center',
})

const EmptyContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.m,
  borderBottomColor: theme.designSystem.color.border.default,
  borderBottomWidth: theme.designSystem.size.spacing.xxs,
}))

const ColoredPassCultureLogo = styled(LogoPassCulture).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
  width: getSpacing(39.25),
  height: getSpacing(13.25),
}))``

const BottomContainer = styled.View(({ theme }) => ({
  flex: 1,
  alignSelf: 'stretch',
  ...(theme.isTouch
    ? {
        justifyContent: 'flex-end',
        marginBottom: theme.designSystem.size.spacing.l,
      }
    : {
        marginTop: getSpacing(25),
      }),
}))
