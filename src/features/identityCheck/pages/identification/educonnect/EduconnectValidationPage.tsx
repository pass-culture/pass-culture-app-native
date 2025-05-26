import React, { FC } from 'react'

import { Summary } from 'features/identityCheck/components/Summary'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

type Props = {
  birthDate?: string | null
  firstName?: string | null
  lastName?: string | null
  address?: string | null
  status?: string | null
  onValidate: VoidFunction
}

export const EduconnectValidationPageButtonName = 'Continuer'

export const EduconnectValidationPage: FC<Props> = ({
  birthDate,
  firstName,
  lastName,
  address,
  status,
  onValidate,
}) => {
  return (
    <PageWithHeader
      title="Informations personnelles"
      scrollChildren={
        <Summary
          title="Tu valides que ces informations sont correctes&nbsp;?"
          data={[
            { title: 'Ton prénom', testID: 'validation-first-name', value: firstName },
            { title: 'Ton nom de famille', testID: 'validation-name', value: lastName },
            { title: 'Adresse', value: address },
            { title: 'Ville de résidence', testID: 'validation-birth-date', value: birthDate },
            { title: 'Statut', value: status },
          ]}
        />
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording={EduconnectValidationPageButtonName}
          onPress={onValidate}
        />
      }
    />
  )
}
