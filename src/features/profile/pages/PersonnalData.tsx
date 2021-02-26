import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { getSpacing } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer } from '../components/reusables'

export function PersonnalData() {
  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Informations personnelles`)} />
      <Container></Container>
    </React.Fragment>
  )
}

const Container = styled(ProfileContainer)({
  padding: getSpacing(4),
})
