import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { ActivityEnum } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

type UserStatusResponse = { name: ActivityEnum; description?: string }

// TODO(antoinewg) dehardcode statuses
const baseStatuses: UserStatusResponse[] = [
  { name: ActivityEnum.Lycen },
  { name: ActivityEnum.Tudiant },
  { name: ActivityEnum.Employ },
  { name: ActivityEnum.Apprenti },
  { name: ActivityEnum.Alternant },
  { name: ActivityEnum.Volontaire, description: 'En service civique' },
  { name: ActivityEnum.Inactif, description: 'En incapacité de travailler' },
  { name: ActivityEnum.Chmeur, description: "En recherche d'emploi" },
]

export const Status = () => {
  const { dispatch, profile } = useIdentityCheckContext()
  const [selectedStatus, setSelectedStatus] = useState<ActivityEnum | null>(profile.status || null)
  const { data: settings } = useAppSettings()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const enabledGeneralisation =
    settings?.enableNativeEacIndividual && settings?.enableUnderageGeneralisation

  const statuses = enabledGeneralisation
    ? ([{ name: 'Collégien' }] as UserStatusResponse[]).concat(baseStatuses)
    : baseStatuses

  const onPressContinue = async () => {
    if (!selectedStatus) return
    await dispatch({ type: 'SET_STATUS', payload: selectedStatus })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={<CenteredTitle title={t`Sélectionne ton statut`} />}
      scrollChildren={
        <React.Fragment>
          {statuses.map((status) => (
            <RadioButton
              key={status.name}
              selected={status.name === selectedStatus}
              description={status.description}
              name={status.name}
              onPress={() => setSelectedStatus(status.name)}
            />
          ))}
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onPressContinue}
          title={!selectedStatus ? t`Choisis ton statut` : t`Continuer`}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
