import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/profile/api'
import { ProfileContainer } from 'features/profile/components/reusables'
import { EditButton } from 'features/profile/pages/PersonalData/EditButton'
import { analytics } from 'libs/analytics'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Trash } from 'ui/svg/icons/Trash'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function PersonalData() {
  const { data: user } = useUserProfileInfo()

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

  const onEmailChange = () => {
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
              <RowTitle>{t`Prénom et nom`}</RowTitle>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{fullname}</Typo.Body>
            </Row>
            <Separator />
          </React.Fragment>
        )}
        <Row>
          <RowTitle>{t`Adresse e-mail`}</RowTitle>
          <Spacer.Column numberOfSpaces={2} />
          <EditContainer>
            <EditText>{user?.email}</EditText>
            <EditButton
              navigateTo={{ screen: 'ChangeEmail' }}
              onPress={onEmailChange}
              wording={t`Modifier`}
              testID="Modifier e-mail"
            />
          </EditContainer>
        </Row>
        <Separator />
        {!!user?.isBeneficiary && (
          <React.Fragment>
            <Row>
              <RowTitle>{t`Numéro de téléphone`}</RowTitle>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body>{user?.phoneNumber}</Typo.Body>
            </Row>
            <Separator />
          </React.Fragment>
        )}
        <Row>
          <RowTitle>{t`Mot de passe`}</RowTitle>
          <Spacer.Column numberOfSpaces={2} />
          <EditContainer>
            <EditText>{'*'.repeat(12)}</EditText>
            <EditButton
              navigateTo={{ screen: 'ChangePassword' }}
              wording={t`Modifier`}
              testID="Modifier mot de passe"
            />
          </EditContainer>
        </Row>
        <Separator />
        <StyledSectionRow
          title={t`Supprimer mon compte`}
          type="navigable"
          navigateTo={{ screen: 'ConfirmDeleteProfile' }}
          onPress={analytics.logAccountDeletion}
          icon={Trash}
        />
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

const StyledSectionRow = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical: getSpacing(6),
})

const EditContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const RowTitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const EditText = styled(Typo.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})
