import React, { ReactNode, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { Background } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

type Props = {
  header?: ReactNode
  noIndex?: boolean
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
}

export const GenericErrorPage: FunctionComponent<Props> = ({
  children,
  header,
  noIndex = true,
  icon,
  title,
  buttons,
}) => {
  const { isTouch } = useTheme()

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
      {header}
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
