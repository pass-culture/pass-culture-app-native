import React, { useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { EditableField } from 'features/profile/components/EditableFiled/EditableField'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { SectionRow } from 'ui/components/SectionRow'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Trash } from 'ui/svg/icons/Trash'
import { Spacer } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

function onEmailChangeClick() {
  void analytics.logModifyMail()
}

export function PersonalData() {
  const { user } = useAuthContext()
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const fullname = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  const hasCity = user?.postalCode && user?.city
  const city =
    hasCity && user?.postalCode && user?.city && user?.street
      ? `${user.street}, ${user.postalCode}, ${user.city}`
      : ''

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const updateEmailRoute = useMemo<ProfileNavigateParams[0]>(() => {
    if (hasCurrentEmailChange) return 'TrackEmailChange'
    return 'ChangeEmail'
  }, [hasCurrentEmailChange])

  return (
    <SecondaryPageWithBlurHeader onGoBack={goBack} title="Informations personnelles">
      <EditableField label="Prénom et nom" value={fullname} />
      <EditableField
        label="Adresse e-mail"
        value={user?.email}
        navigateTo={updateEmailRoute}
        onBeforeNavigate={onEmailChangeClick}
        accessibilityLabel="Modifier e-mail"
      />
      <EditableField label="Numéro de téléphone" value={user?.phoneNumber} />
      <EditableField
        label="Mot de passe"
        value={'*'.repeat(12)}
        navigateTo="ChangePassword"
        accessibilityLabel="Modifier mot de passe"
      />
      <EditableField
        label="Statut"
        value={getActivityLabel(user?.activityId)}
        navigateTo="ChangeStatus"
        accessibilityLabel="Modifier le statut"
      />
      <EditableField
        label="Adresse de résidence"
        value={city}
        navigateTo="ChangeCity"
        navigateParams={{ type: PersonalDataTypes.PROFIL_PERSONAL_DATA }}
        accessibilityLabel="Modifier mon adresse de résidence"
      />
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
