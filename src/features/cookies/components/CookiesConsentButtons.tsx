import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { getSpacing, Spacer } from 'ui/theme'

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
        <ButtonPrimary wording={t`Tout refuser`} onPress={onPressDeclineAll} />
      </Row>
      <ButtonSpacer />
      <Row>
        <ButtonPrimary wording={t`Tout accepter`} onPress={onPressAcceptAll} />
      </Row>
    </Container>
    <Spacer.Column numberOfSpaces={4} />
    <ButtonSecondary wording={t`Choisir les cookies`} onPress={onPressChooseCookies} />
  </React.Fragment>
)

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  flexDirection: theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column-reverse',
  width: '100%',
}))

const ButtonSpacer = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.xs ? getSpacing(2) : 0,
  height: theme.appContentWidth > theme.breakpoints.xs ? 0 : getSpacing(4),
}))

const Row = styled.View(({ theme }) => ({
  flex: theme.appContentWidth > theme.breakpoints.xs ? 1 : undefined,
}))
