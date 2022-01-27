import React, { ReactNode, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { Background } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  header?: ReactNode
  noIndex?: boolean
  icon?: FunctionComponent<IconInterface>
  title: string
  buttons?: Array<ReactNode>
}

const ICON_SIZE = getSpacing(50)

export const GenericErrorPage: FunctionComponent<Props> = ({
  children,
  header,
  noIndex = true,
  icon: Icon,
  title,
  buttons,
}) => {
  const { isTouch, colors } = useTheme()
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
            <Icon color={colors.white} size={ICON_SIZE} />
            <Spacer.Column numberOfSpaces={spacingMatrix.afterIcon} />
          </React.Fragment>
        )}
        <StyledTitle2>{title}</StyledTitle2>
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

const StyledTitle2 = styled(Typo.Title2)(({ theme }) => ({
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
