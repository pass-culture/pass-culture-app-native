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

export const HomeButtons = ({
  onPressAcceptAll,
  onPressDeclineAll,
  onPressChooseCookies,
}: Props) => {
  return (
    <React.Fragment>
      <Row>
        <ButtonPrimary wording={t`Tout refuser`} onPress={onPressDeclineAll} />
        <Spacer.Row numberOfSpaces={5} />
        <ButtonPrimary wording={t`Tout accepter`} onPress={onPressAcceptAll} />
      </Row>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonSecondary wording={t`Choisir les cookies`} onPress={onPressChooseCookies} />
    </React.Fragment>
  )
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
}))
