import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { usePostHonorStatement } from 'features/identityCheck/api/usePostHonorStatement'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { Declaration } from 'features/identityCheck/components/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { QueryKeys } from 'libs/queryKeys'
import { hasOngoingCredit } from 'shared/user/useAvailableCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

export const IdentityCheckHonor = () => {
  useEffect(() => {
    analytics.logScreenViewIdentityCheckHonor()
  }, [])
  const theme = useTheme()
  const { showErrorSnackBar } = useSnackBarContext()
  const queryClient = useQueryClient()
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetchUser } = useAuthContext()
  const saveStep = useSaveStep()

  const {
    mutate: postHonorStatement,
    isLoading: isPostingHonorLoading,
    isSuccess: isPostingHonorSuccess,
  } = usePostHonorStatement({
    onSuccess: async () => {
      queryClient.invalidateQueries([QueryKeys.NEXT_SUBSCRIPTION_STEP])
      queryClient.invalidateQueries([QueryKeys.HOME_BANNER])
      let userProfile
      try {
        const { data: user } = await refetchUser()
        userProfile = user
      } catch (error) {
        showErrorSnackBar({
          message: extractApiErrorMessage(error),
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
      const hasUserOngoingCredit = userProfile ? hasOngoingCredit(userProfile) : false
      if (hasUserOngoingCredit) {
        navigate('BeneficiaryAccountCreated')
      } else {
        saveStep(IdentityCheckStep.CONFIRMATION)
        navigate('BeneficiaryRequestSent')
      }
    },
    onError: (error) =>
      showErrorSnackBar({
        message: extractApiErrorMessage(error),
        timeout: SNACK_BAR_TIME_OUT,
      }),
  })

  // If the mutation is loading or is a success, we don't want the user to trigger the button again
  const isSubmitButtonEnabled = isPostingHonorLoading || isPostingHonorSuccess
  useEnterKeyAction(() => postHonorStatement())

  return (
    <PageWithHeader
      title="Confirmation"
      scrollChildren={
        <Container>
          <CenteredTitle title="Les informations que tu as renseignées sont-elles correctes&nbsp;?" />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <Declaration
            text="Je déclare que l’ensemble des informations que j’ai renseignées sont correctes."
            description="Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni. En cas de fraude, des poursuites judiciaires pourraient être engagées."
          />
          {theme.isMobileViewport ? (
            <Spacer.Flex flex={2} />
          ) : (
            <Spacer.Column numberOfSpaces={10} />
          )}
          <ButtonContainer>
            <ButtonPrimary
              type="submit"
              onPress={postHonorStatement}
              wording="Valider et continuer"
              isLoading={isSubmitButtonEnabled}
            />
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      }
    />
  )
}

const Container = styled.View({ flexGrow: 1 })
const ButtonContainer = styled.View({ paddingVertical: getSpacing(5) })
