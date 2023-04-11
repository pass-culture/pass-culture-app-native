import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { InfoBanner } from 'ui/components/InfoBanner'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Trash } from 'ui/svg/icons/Trash'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function PersonalData() {
  const { user } = useAuthContext()

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

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
      </EditContainer>

      <StyledSeparator />

      {user?.isBeneficiary && user?.phoneNumber ? (
        <React.Fragment>
          <Typo.CaptionNeutralInfo>Numéro de téléphone</Typo.CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{user?.phoneNumber}</Typo.Body>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

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

      <InfoBanner message="Le pass Culture traite tes données pour la gestion de ton compte et pour l’inscription à la newsletter.">
        <Spacer.Column numberOfSpaces={3} />
        <ExternalTouchableLink
          as={ButtonQuaternarySecondary}
          externalNav={{ url: env.FAQ_LINK_PERSONAL_DATA }}
          wording="Comment gérer tes données personnelles&nbsp;?"
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          inline
        />
      </InfoBanner>
      <Spacer.Column numberOfSpaces={8} />
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
