import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'

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
    <PageWithHeader title={t`Sélectionne ton statut`}>
      <ContentContainer>
        {statuses.map((status) => (
          <RadioButton
            key={status.name}
            selected={status.name === selectedStatus}
            description={status.description}
            name={status.name}
            onPress={() => setSelectedStatus(status.name)}
          />
        ))}
        <Spacer.Column numberOfSpaces={8} />
      </ContentContainer>

      <Spacer.BottomScreen />

      <FixedButtonContainer>
        <ButtonPrimary
          onPress={goBack}
          title={!selectedStatus ? 'Choisis ton statut' : 'Valider mon statut'}
          disabled={!selectedStatus}
        />
      </FixedButtonContainer>
    </PageWithHeader>
  )
}

const ContentContainer = styled.ScrollView({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: getSpacing(125),
})

const FixedButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: getSpacing(2),
  width: '100%',
  maxWidth: getSpacing(125),
})
