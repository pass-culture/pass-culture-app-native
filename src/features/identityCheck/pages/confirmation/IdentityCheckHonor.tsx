import { t } from '@lingui/macro'
import React from 'react'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { usePostHonorStatement } from 'features/identityCheck/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { Declaration } from 'features/identityCheck/atoms/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer } from 'ui/theme'

export const IdentityCheckHonor = () => {
  const theme = useTheme()
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { showErrorSnackBar } = useSnackBarContext()
  const queryClient = useQueryClient()

  const { mutate: postHonorStatement, isLoading } = usePostHonorStatement({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.USER_PROFILE)

      navigateToNextScreen()
    },
    onError: (error) =>
      showErrorSnackBar({
        message: extractApiErrorMessage(error),
        timeout: SNACK_BAR_TIME_OUT,
      }),
  })

  return (
    <PageWithHeader
      title={t`Confirmation`}
      fixedTopChildren={
        <Container>
          <CenteredTitle
            title={t`Les informations que tu as renseignées sont-elles correctes\u00a0?`}
          />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <Declaration
            text={t`Je déclare que l'ensemble des informations que j’ai renseignées sont correctes.`}
            description={t`Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni. En cas de fraude, des poursuites judiciaires pourraient être engagées.`}
          />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <ButtonContainer>
            <ButtonPrimary
              onPress={postHonorStatement}
              title={t`Valider et continuer`}
              isLoading={isLoading}
            />
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      }
    />
  )
}

const Container = styled.View({ height: '100%' })
const ButtonContainer = styled.View({ paddingVertical: getSpacing(5) })
