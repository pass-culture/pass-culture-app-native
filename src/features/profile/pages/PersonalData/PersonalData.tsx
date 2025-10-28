import React, { useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { EditableField } from 'features/profile/components/EditableFiled/EditableField'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { SectionRow } from 'ui/components/SectionRow'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Trash } from 'ui/svg/icons/Trash'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

function onEmailChangeClick() {
  void analytics.logModifyMail()
}

export function PersonalData() {
  const { user } = useAuthContext()
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

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
        <Banner
          label="Le pass Culture traite tes données pour la gestion de ton compte et pour l’inscription à la newsletter."
          links={[
            {
              wording: 'Comment gérer tes données personnelles\u00a0?',
              externalNav: { url: env.FAQ_LINK_PERSONAL_DATA },
            },
          ]}
        />
        <SectionRow
          title="Supprimer mon compte"
          type="navigable"
          navigateTo={getProfilePropConfig('DeleteProfileReason')}
          onPress={analytics.logAccountDeletion}
          icon={Trash}
          iconSize={SECTION_ROW_ICON_SIZE}
        />
      </ViewGap>
    </SecondaryPageWithBlurHeader>
  )
}
