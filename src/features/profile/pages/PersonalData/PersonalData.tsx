import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { RootNavigateParams } from 'features/navigation/RootNavigator/types'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Trash } from 'ui/svg/icons/Trash'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

function onEmailChangeClick() {
  void analytics.logModifyMail()
}

export function PersonalData() {
  const { user } = useAuthContext()
  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const updateEmailRoute = useMemo<RootNavigateParams[0]>(() => {
    if (hasCurrentEmailChange) return 'TrackEmailChange'
    return 'ChangeEmail'
  }, [hasCurrentEmailChange])

  return (
    <SecondaryPageWithBlurHeader title="Informations personnelles">
      {user?.isBeneficiary ? (
        <React.Fragment>
          <Typo.CaptionNeutralInfo>Prénom et nom</Typo.CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{fullname}</Typo.Body>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      <Typo.CaptionNeutralInfo>Adresse e-mail</Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
      <EditContainer>
        <EditText>{user?.email}</EditText>
        <EditButton
          navigateTo={{ screen: updateEmailRoute }}
          onPress={onEmailChangeClick}
          wording="Modifier"
          accessibilityLabel="Modifier e-mail"
        />
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

      {user?.hasPassword ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : null}

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
    </SecondaryPageWithBlurHeader>
  )
}

const StyledSeparator = styled(Separator.Horizontal)({
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
