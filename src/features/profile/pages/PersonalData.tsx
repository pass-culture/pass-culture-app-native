import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { _ } from 'libs/i18n'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer, Separator } from '../components/reusables'

export function PersonalData() {
  const { data: user } = useUserProfileInfo()

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Informations personnelles`)} />
      <Container>
        {user?.isBeneficiary && (
          <React.Fragment>
            <Row>
              <Typo.Caption>{_(t`Prénom et nom`)}</Typo.Caption>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{fullname}</Typo.Body>
            </Row>
            <Separator />
          </React.Fragment>
        )}
        <Row>
          <Typo.Caption>{_(t`E-mail`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{user?.email}</Typo.Body>
        </Row>
        <Separator />
        {user?.isBeneficiary && (
          <React.Fragment>
            <Row>
              <Typo.Caption>{_(t`Numéro de téléphone`)}</Typo.Caption>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{user?.phoneNumber}</Typo.Body>
            </Row>
            <Separator />
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  )
}

const Container = styled(ProfileContainer)({
  padding: getSpacing(4),
  paddingTop: 0,
})

const Row = styled.View({
  paddingVertical: getSpacing(4),
})
