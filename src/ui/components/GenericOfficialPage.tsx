import React, { ReactNode, useMemo, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { AnimationObject } from 'ui/animations/type'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { IconInterface } from 'ui/svg/icons/types'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  headerGoBack?: boolean
  onGoBackPress?: () => void
  noIndex?: boolean
  flex?: boolean
  animation?: AnimationObject
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
}

export const GenericOfficialPage: FunctionComponent<Props> = ({
  children,
  noIndex = true,
  title,
  flex = true,
  buttons,
}) => {
  const { isTouch } = useTheme()
  const Wrapper = useMemo(() => (flex ? Container : React.Fragment), [flex])

  const getButtonSpaces = () => {
    if (buttons) {
      return buttons.length === 1
        ? spacingMatrix.bottomWithOneButton
        : spacingMatrix.bottomWithMoreThanOneButton
    }
    return spacingMatrix.bottom
  }

  return (
    <Wrapper>
      {!!noIndex && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <Spacer.TopScreen />
      <HeaderContainer>
        <IllustrationsContainer>
          <LogoMinistereContainer>
            <LogoMinistere />
          </LogoMinistereContainer>
          <LogoPassCultureContainer>
            <ColoredPassCultureLogo />
          </LogoPassCultureContainer>
        </IllustrationsContainer>
        <EmptyContainer />
      </HeaderContainer>
      <Content>
        {!!isTouch && (
          <React.Fragment>
            <Spacer.Flex />
            <Spacer.Column numberOfSpaces={spacingMatrix.top} />
          </React.Fragment>
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
      </Content>
      <BottomContent>
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
      </BottomContent>
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
  overflowY: 'auto',
})

const StyledTitle = styled(Typo.Title2).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  color: theme.colors.black,
}))

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

const LogoMinistereContainer = styled.View({
  width: getSpacing(33),
  height: getSpacing(22),
})

const LogoPassCultureContainer = styled.View({
  justifyContent: 'center',
})

const EmptyContainer = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(3),
  borderBottomColor: theme.colors.greyMedium,
  borderBottomWidth: getSpacing(0.25),
}))

const ColoredPassCultureLogo = styled(LogoPassCulture).attrs(({ theme }) => ({
  color: theme.uniqueColors.brand,
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
