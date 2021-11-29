import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { ActivityEnum } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
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
  const { goBack } = useGoBack(...homeNavConfig)
  const [selectedStatus, setSelectedStatus] = useState<ActivityEnum | undefined>()
  const { data: settings } = useAppSettings()

  const enabledGeneralisation =
    settings?.enableNativeEacIndividual && settings?.enableUnderageGeneralisation

  const statuses = enabledGeneralisation
    ? ([{ name: 'Collégien' }] as UserStatusResponse[]).concat(baseStatuses)
    : baseStatuses

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
          onPress={goBack}
          title={!selectedStatus ? t`Choisis ton statut` : t`Continuer`}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
