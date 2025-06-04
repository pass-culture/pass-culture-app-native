import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()
  const hasCity = user?.postalCode && user?.city
  const city = hasCity && user?.postalCode && user?.city ? `${user.postalCode}, ${user.city}` : ''

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const updateEmailRoute = useMemo<ProfileNavigateParams[0]>(() => {
    if (hasCurrentEmailChange) return 'TrackEmailChange'
    return 'ChangeEmail'
  }, [hasCurrentEmailChange])

  return (
    <SecondaryPageWithBlurHeader onGoBack={goBack} title="Informations personnelles">
      {user?.isBeneficiary ? (
        <React.Fragment>
          <ViewGap gap={2}>
            <CaptionNeutralInfo>Prénom et nom</CaptionNeutralInfo>
            <Typo.Body>{fullname}</Typo.Body>
          </ViewGap>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      <CaptionNeutralInfo>Adresse e-mail</CaptionNeutralInfo>
      <EditContainer>
        <EditText>{user?.email}</EditText>
        <EditButton
          navigateTo={getProfileNavConfig(updateEmailRoute)}
          onPress={onEmailChangeClick}
          wording="Modifier"
          accessibilityLabel="Modifier e-mail"
        />
      </EditContainer>

      <StyledSeparator />

      {user?.isBeneficiary && user?.phoneNumber ? (
        <React.Fragment>
          <ViewGap gap={2}>
            <CaptionNeutralInfo>Numéro de téléphone</CaptionNeutralInfo>
            <Typo.Body>{user?.phoneNumber}</Typo.Body>
          </ViewGap>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      {user?.hasPassword ? (
        <React.Fragment>
          <CaptionNeutralInfo>Mot de passe</CaptionNeutralInfo>
          <EditContainer>
            <EditText>{'*'.repeat(12)}</EditText>
            <EditButton
              navigateTo={getProfileNavConfig('ChangePassword')}
              wording="Modifier"
              accessibilityLabel="Modifier mot de passe"
            />
          </EditContainer>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      {user?.isBeneficiary ? (
        <React.Fragment>
          <CaptionNeutralInfo>Statut</CaptionNeutralInfo>
          <EditContainer>
            <EditText>{getActivityLabel(user?.activityId)}</EditText>
            <EditButton
              navigateTo={getProfileNavConfig('ChangeStatus')}
              wording="Modifier"
              accessibilityLabel="Modifier le statut"
            />
          </EditContainer>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      {user?.isBeneficiary ? (
        <React.Fragment>
          <CaptionNeutralInfo>Ville de résidence</CaptionNeutralInfo>
          <EditContainer>
            <EditText numberOfLines={2}>{city}</EditText>
            <EditButton
              navigateTo={getProfileNavConfig('ChangeCity')}
              wording="Modifier"
              accessibilityLabel="Modifier la ville de résidence"
            />
          </EditContainer>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      <ViewGap gap={8}>
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
        <SectionRow
          title="Supprimer mon compte"
          type="navigable"
          navigateTo={getProfileNavConfig('DeleteProfileReason')}
          onPress={analytics.logAccountDeletion}
          icon={Trash}
          iconSize={SECTION_ROW_ICON_SIZE}
        />
      </ViewGap>
    </SecondaryPageWithBlurHeader>
  )
}

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})

const EditContainer = styled.View({
  marginTop: getSpacing(2),
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const EditText = styled(Typo.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
