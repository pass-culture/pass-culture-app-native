import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

type UserStatus =
  | 'Lycéen'
  | 'Étudiant'
  | 'Employé'
  | 'Apprenti'
  | 'Alternant'
  | 'Volontaire'
  | 'Inactif'
  | 'Chômeur'

type UserStatusResponse = { name: UserStatus; description?: string }

// TODO(antoinewg) dehardcode statuses
const statuses: UserStatusResponse[] = [
  { name: 'Lycéen' },
  { name: 'Étudiant' },
  { name: 'Employé' },
  { name: 'Apprenti' },
  { name: 'Alternant' },
  { name: 'Volontaire', description: 'En service civique' },
  { name: 'Inactif', description: 'En incapacité de travailler' },
  { name: 'Chômeur', description: "En recherche d'emploi" },
]

export const Status = () => {
  const { goBack } = useGoBack(...homeNavConfig)
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | undefined>()

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ModalContent>
          <CenteredTitle title={t`Sélectionne ton statut`} />
          {statuses.map((status) => (
            <RadioButton
              key={status.name}
              selected={status.name === selectedStatus}
              description={status.description}
              name={status.name}
              onPress={() => setSelectedStatus(status.name)}
            />
          ))}
          <Spacer.Column numberOfSpaces={16} />
        </ModalContent>
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
