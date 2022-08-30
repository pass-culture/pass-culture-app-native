import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
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
        <ButtonPrimary wording={t`Tout refuser`} onPress={onPressDeclineAll} />
      </Row>
      <Spacer.Row numberOfSpaces={2} />
      <Row>
        <ButtonPrimary wording={t`Tout accepter`} onPress={onPressAcceptAll} />
      </Row>
    </Container>
    <Spacer.Column numberOfSpaces={5} />
    <ButtonSecondary wording={t`Choisir les cookies`} onPress={onPressChooseCookies} />
  </React.Fragment>
)

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  flexDirection: 'row',
  width: '100%',
}))

const Row = styled.View({
  flex: 1,
})
