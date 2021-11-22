import { t } from '@lingui/macro'
import React from 'react'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Typo } from 'ui/theme'

export const SetAddress = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={<Typo.Body>{t`Quelle est ton adresse ?`}</Typo.Body>}
      fixedBottomChildren={<ButtonPrimary onPress={goBack} title={t`Continuer`} disabled={false} />}
    />
  )
}
