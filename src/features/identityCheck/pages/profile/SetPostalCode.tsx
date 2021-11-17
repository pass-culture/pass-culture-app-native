import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing } from 'ui/theme'

export const SetPostalCode = () => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ContentContainer>
          <CenteredTitle title={t`Dans quelle ville résides-tu ?`} />
        </ContentContainer>
      }
      fixedBottomChildren={<ButtonPrimary onPress={goBack} title={t`Continuer`} disabled={false} />}
    />
  )
}

const ContentContainer = styled.ScrollView({
  width: '100%',
  maxWidth: getSpacing(125),
})
