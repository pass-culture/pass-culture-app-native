import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { EditPen } from 'ui/svg/icons/EditPen'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileContainer } from '../components/reusables'

export function PersonalData() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

  const onEmailChange = () => {
    navigate('ChangeEmail')
    analytics.logModifyMail()
  }

  return (
    <React.Fragment>
      <PageHeader title={t`Informations personnelles`} />
      <Spacer.TopScreen />
      <Container>
        <Spacer.Column numberOfSpaces={14} />
        {!!user?.isBeneficiary && (
          <React.Fragment>
            <Row>
              <Typo.Caption>{t`Prénom et nom`}</Typo.Caption>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{fullname}</Typo.Body>
            </Row>
            <Separator />
          </React.Fragment>
        )}
        <Row>
          <Typo.Caption>{t`Adresse e-mail`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <EmailContainer>
            <EmailText>{user?.email}</EmailText>
            <ButtonQuaternary wording={t`Modifier`} icon={EditPen} inline onPress={onEmailChange} />
          </EmailContainer>
        </Row>
        <Separator />
        {!!user?.isBeneficiary && (
          <React.Fragment>
            <Row>
              <Typo.Caption>{t`Numéro de téléphone`}</Typo.Caption>
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
  padding: getSpacing(5.5),
  paddingTop: 0,
})

const Row = styled.View({
  paddingVertical: getSpacing(4),
})

const EmailContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const EmailText = styled(Typo.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})
