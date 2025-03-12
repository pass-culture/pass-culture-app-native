import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { ActivityIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Trash } from 'ui/svg/icons/Trash'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

function onEmailChangeClick() {
  void analytics.logModifyMail()
}

const ACTIVITIES: Record<ActivityIdEnum, string> = {
  [ActivityIdEnum.MIDDLE_SCHOOL_STUDENT]: 'Collégien',
  [ActivityIdEnum.HIGH_SCHOOL_STUDENT]: 'Lycéen',
  [ActivityIdEnum.STUDENT]: 'Étudiant',
  [ActivityIdEnum.EMPLOYEE]: 'Employé',
  [ActivityIdEnum.APPRENTICE]: 'Apprenti',
  [ActivityIdEnum.APPRENTICE_STUDENT]: 'Alternant',
  [ActivityIdEnum.VOLUNTEER]: 'Volontaire',
  [ActivityIdEnum.INACTIVE]: 'Inactif',
  [ActivityIdEnum.UNEMPLOYED]: 'Demandeur d’emploi',
}

export function PersonalData() {
  const { user } = useAuthContext()
  const fullname = String(user?.firstName + ' ' + user?.lastName).trim()
  const hasCity = user?.postalCode && user?.city
  const city = hasCity && user?.postalCode && user?.city ? `${user.postalCode}, ${user.city}` : ''

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const updateEmailRoute = useMemo<ProfileNavigateParams[0]>(() => {
    if (hasCurrentEmailChange) return 'TrackEmailChange'
    return 'ChangeEmail'
  }, [hasCurrentEmailChange])

  return (
    <SecondaryPageWithBlurHeader title="Informations personnelles">
      {user?.isBeneficiary ? (
        <React.Fragment>
          <CaptionNeutralInfo>Prénom et nom</CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <TypoDS.Body>{fullname}</TypoDS.Body>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      <CaptionNeutralInfo>Adresse e-mail</CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
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
          <CaptionNeutralInfo>Numéro de téléphone</CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <TypoDS.Body>{user?.phoneNumber}</TypoDS.Body>
          <StyledSeparator />
        </React.Fragment>
      ) : null}

      {user?.hasPassword ? (
        <React.Fragment>
          <CaptionNeutralInfo>Mot de passe</CaptionNeutralInfo>
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

      {user?.isBeneficiary ? (
        <React.Fragment>
          <CaptionNeutralInfo>Statut</CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={2} />
          <EditContainer>
            <EditText>{user?.activityId && ACTIVITIES[user.activityId]}</EditText>
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
          <Spacer.Column numberOfSpaces={2} />
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
        navigateTo={getProfileNavConfig('DeleteProfileReason')}
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

const EditText = styled(TypoDS.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
