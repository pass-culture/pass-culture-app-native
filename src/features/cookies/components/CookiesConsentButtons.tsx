import React from 'react'
import styled from 'styled-components/native'

import { Button } from 'ui/designSystem/Button/Button'
import { Spacer } from 'ui/theme'

interface Props {
  onPressAcceptAll: () => void
  onPressDeclineAll: () => void
  onPressChooseCookies: () => void
}

export const CookiesConsentButtons = ({
  onPressAcceptAll,
  onPressDeclineAll,
  onPressChooseCookies,
}: Props) => (
  <React.Fragment>
    <Container>
      <Row>
        <Button wording="Tout refuser" onPress={onPressDeclineAll} fullWidth />
      </Row>
      <ButtonSpacer />
      <Row>
        <Button wording="Tout accepter" onPress={onPressAcceptAll} fullWidth />
      </Row>
    </Container>
    <Spacer.Column numberOfSpaces={4} />
    <Button
      variant="secondary"
      wording="Choisir les cookies"
      onPress={onPressChooseCookies}
      fullWidth
    />
  </React.Fragment>
)

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  flexDirection: theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column-reverse',
  width: '100%',
}))

const ButtonSpacer = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.xs ? theme.designSystem.size.spacing.s : 0,
  height: theme.appContentWidth > theme.breakpoints.xs ? 0 : theme.designSystem.size.spacing.l,
}))

const Row = styled.View(({ theme }) => ({
  flex: theme.appContentWidth > theme.breakpoints.xs ? 1 : undefined,
}))
