import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { Declaration } from 'features/identityCheck/atoms/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'

export const IdentityCheckHonor = () => {
  const theme = useTheme()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  return (
    <PageWithHeader
      title={t`Confirmation`}
      fixedTopChildren={
        <Container>
          <CenteredTitle title={t`Les informations que tu as renseignées sont-elles correctes ?`} />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <Declaration
            text={t`Je déclare que l'ensemble des informations que j’ai renseignées sont correctes.`}
            description={t`Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni. En cas de fraude, des poursuites judiciaires pourraient être engagées.`}
          />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <ButtonContainer>
            <ButtonPrimary onPress={navigateToNextScreen} title={t`Valider et continuer`} />
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      }
    />
  )
}

const Container = styled.View({ height: '100%' })
const ButtonContainer = styled.View({ paddingVertical: getSpacing(5) })
