import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Background } from 'ui/svg/Background'
import { getSpacing, Typo } from 'ui/theme'

type WithBackgroundProps = {
  withBackground?: boolean
}
type Props = WithBackgroundProps & {
  title?: string
}

export const StoryContainer: FunctionComponent<Props> = ({
  children,
  title,
  withBackground = false,
}) => (
  <Container>
    {!!title && <Typo.Body>{title}</Typo.Body>}
    <ChildrenContainer withBackground={withBackground}>
      {!!withBackground && <Background />}
      {children}
    </ChildrenContainer>
  </Container>
)

const Container = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(2),
  alignSelf: 'flex-start',
  minWidth: theme.contentPage.maxWidth,
}))

const ChildrenContainer = styled.View<WithBackgroundProps>(({ withBackground }) => ({
  padding: withBackground ? getSpacing(5) : 0,
}))
