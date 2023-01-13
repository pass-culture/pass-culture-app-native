import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { analytics } from 'libs/firebase/analytics'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Trash } from 'ui/svg/icons/Trash'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function PersonalData() {
  const { user } = useAuthContext()

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

  const onEmailChange = () => {
    analytics.logModifyMail()
  }

  return (
    <PageProfileSection title="Informations personnelles">
      {!!user?.isBeneficiary && (
        <React.Fragment>
          <Typo.CaptionNeutralInfo>Prénom et nom</Typo.CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{fullname}</Typo.Body>
          <StyledSeparator />
        </React.Fragment>
      )}

      <Typo.CaptionNeutralInfo>Adresse e-mail</Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
      <EditContainer>
        <EditText>{user?.email}</EditText>
        <EditButton
          navigateTo={{ screen: 'ChangeEmail' }}
          onPress={onEmailChange}
          wording="Modifier"
          accessibilityLabel="Modifier e-mail"
        />
      </EditContainer>

      <StyledSeparator />

      {!!user?.isBeneficiary && (
        <React.Fragment>
          <Typo.CaptionNeutralInfo>Numéro de téléphone</Typo.CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{user?.phoneNumber}</Typo.Body>
          <StyledSeparator />
        </React.Fragment>
      )}

      <Typo.CaptionNeutralInfo>Mot de passe</Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
      <EditContainer>
        <EditText>{'*'.repeat(12)}</EditText>
        <EditButton
          navigateTo={{ screen: 'ChangePassword' }}
          wording="Modifier"
          accessibilityLabel="Modifier mot de passe"
        />
      </EditContainer>

      <StyledSeparator />

      <Spacer.Column numberOfSpaces={2} />
      <SectionRow
        title="Supprimer mon compte"
        type="navigable"
        navigateTo={{ screen: 'ConfirmDeleteProfile' }}
        onPress={analytics.logAccountDeletion}
        icon={Trash}
        iconSize={SECTION_ROW_ICON_SIZE}
      />
    </PageProfileSection>
  )
}

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})

const EditContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const EditText = styled(Typo.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})
