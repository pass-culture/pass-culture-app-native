import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { getSpacing, Typo } from 'ui/theme'

import { ProfileSection } from '../components/ProfileSection'

export const Profile: React.FC = () => {
  return (
    <Container>
      <ProfileSection title={_(t`Paramètres du compte`)}>
        <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
      </ProfileSection>
      <ProfileSection title={_(t`Aides`)}>
        <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
      </ProfileSection>
      <ProfileSection title={_(t`Autres`)}>
        <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
      </ProfileSection>
      <ProfileSection title={_(t`Suivre Pass Culture`)}>
        <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
      </ProfileSection>
    </Container>
  )
}

const Container = styled.View({ flex: 1, padding: getSpacing(5) })
