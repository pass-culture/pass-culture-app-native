import { t } from '@lingui/macro'
import React, { ReactNode, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { Helmet } from 'libs/react-helmet/Helmet'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Background } from 'ui/svg/Background'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  headerGoBack?: boolean
  noIndex?: boolean
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
}

export const GenericErrorPage: FunctionComponent<Props> = ({
  children,
  headerGoBack,
  noIndex = true,
  icon,
  title,
  buttons,
}) => {
  const { isTouch } = useTheme()
  const { top } = useCustomSafeInsets()
  const { canGoBack, goBack } = useGoBack(...homeNavConfig)
  const Icon =
    !!icon &&
    styled(icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.colors.white,
    }))``

  return (
    <Container>
      {!!noIndex && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <Background />
      {headerGoBack && canGoBack() ? (
        <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="Revenir en arrière">
          <StyledArrowPrevious />
        </HeaderContainer>
      ) : null}
      <Content>
        <Spacer.TopScreen />
        <Spacer.Flex />
        {!!isTouch && <Spacer.Column numberOfSpaces={spacingMatrix.top} />}
        {!!Icon && (
          <React.Fragment>
            <Icon />
            <Spacer.Column numberOfSpaces={spacingMatrix.afterIcon} />
          </React.Fragment>
        )}
        <StyledTitle>{title}</StyledTitle>
        <Spacer.Column numberOfSpaces={spacingMatrix.afterTitle} />
        {children}
        <Spacer.Column numberOfSpaces={spacingMatrix.afterChildren} />
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
        {!!isTouch && <Spacer.Column numberOfSpaces={spacingMatrix.bottom} />}
        <Spacer.Flex />
        <Spacer.BottomScreen />
      </Content>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const spacingMatrix = {
  top: 10,
  afterIcon: 5,
  afterTitle: 5,
  afterChildren: 10,
  bottom: 10,
}

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
  accessibilityLabel: t`Revenir en arrière`,
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
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
})

const BottomContainer = styled.View({
  flex: 1,
  alignSelf: 'stretch',
})
