import { t } from '@lingui/macro'
import React from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { StyledScrollView } from 'features/identityCheck/atoms/StyledScrollView'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const SetPostalCode = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <StyledScrollView>
          <CenteredTitle title={t`Dans quelle ville résides-tu ?`} />
        </StyledScrollView>
      }
      fixedBottomChildren={<ButtonPrimary onPress={goBack} title={t`Continuer`} disabled={false} />}
    />
  )
}
