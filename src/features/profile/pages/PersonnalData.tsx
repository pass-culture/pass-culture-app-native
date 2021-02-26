import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer, Separator } from '../components/reusables'

export function PersonnalData() {
  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Informations personnelles`)} />
      <Container>
        <Row>
          <Typo.Caption>{_(t`Prénom et nom`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{_(t`Rosa Bonheur`)}</Typo.Body>
        </Row>
        <Separator />
        <Row>
          <Typo.Caption>{_(t`E-mail`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{_(t`Rosa.bonheur@gmail.com`)}</Typo.Body>
        </Row>
        <Separator />
        <Row>
          <Typo.Caption>{_(t`Numéro de téléphone`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{_(t`+33 6 12 34 56 78`)}</Typo.Body>
        </Row>
        <Separator />
      </Container>
    </React.Fragment>
  )
}

const Container = styled(ProfileContainer)({
  padding: getSpacing(4),
})

const Row = styled.View({
  paddingVertical: getSpacing(4),
})
