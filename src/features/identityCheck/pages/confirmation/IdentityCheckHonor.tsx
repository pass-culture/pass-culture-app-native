import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { Declaration } from 'features/identityCheck/atoms/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const IdentityCheckHonor = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onPress = () => navigate('IdentityCheckStatus')

  return (
    <PageWithHeader
      title={t`Confirmation`}
      fixedTopChildren={
        <CenteredTitle title={t`Les informations que tu as renseignées sont-elles correctes ?`} />
      }
      scrollChildren={
        <Declaration
          text={t`Je déclare que l'ensemble des informations que j’ai renseignées sont correctes.`}
          description={t`Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni. En cas de fraude, des poursuites judiciaires pourraient être engagées.`}
        />
      }
      fixedBottomChildren={<ButtonPrimary onPress={onPress} title={t`Valider et continuer`} />}
    />
  )
}
