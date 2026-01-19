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
  const { isTouch } = useTheme()

  const getButtonSpaces = () => {
    if (buttons) {
      return buttons.length === 1
        ? spacingMatrix.bottomWithOneButton
        : spacingMatrix.bottomWithMoreThanOneButton
    }
    return spacingMatrix.bottom
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
          <React.Fragment>
            <Spacer.Flex />
            <Spacer.Column numberOfSpaces={spacingMatrix.top} />
          </React.Fragment>
        ) : null}
        <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
        <Spacer.Column numberOfSpaces={spacingMatrix.afterTitle} />
        {children}
        {isTouch ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={getButtonSpaces()} />
            <Spacer.Flex flex={0.5} />
          </React.Fragment>
        ) : null}
      </Content>
      <BottomContent>
        {buttons ? (
          <BottomContainer>
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                {index === 0 ? null : <Spacer.Column numberOfSpaces={4} />}
                {button}
              </React.Fragment>
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
  overflowY: 'auto',
})

const Content = styled.View(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  flexShrink: theme.isNative ? 1 : 0,
  flexBasis: 'auto',
  justifyContent: 'center',
  paddingHorizontal: getSpacing(6),
  width: '100%',
  maxWidth: getSpacing(100),
}))

const BottomContent = styled.View({
  flexDirection: 'column',
  flex: 1,
  flexBasis: 'auto',
  paddingHorizontal: getSpacing(6),
  width: '100%',
  maxWidth: getSpacing(100),
})

const HeaderContainer = styled.View({
  maxWidth: getSpacing(100),
  width: '100%',
  paddingTop: getSpacing(4),
  paddingHorizontal: getSpacing(6),
})

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
  borderBottomWidth: getSpacing(0.25),
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
        marginBottom: getSpacing(4),
      }
    : {
        marginTop: getSpacing(25),
        maxHeight: getSpacing(1),
      }),
}))
