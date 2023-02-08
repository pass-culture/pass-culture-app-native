import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { usePostHonorStatement } from 'features/identityCheck/api/usePostHonorStatement'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { Declaration } from 'features/identityCheck/atoms/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionNavigation } from 'features/identityCheck/useSubscriptionNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { amplitude } from 'libs/amplitude'
import { QueryKeys } from 'libs/queryKeys'
import { hasOngoingCredit } from 'shared/user/useAvailableCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

export const IdentityCheckHonor = () => {
  useEffect(() => {
    amplitude.logEvent('screen_view_identity_check_honor')
  }, [])
  const theme = useTheme()
  const { navigateToNextScreen } = useSubscriptionNavigation()
  const { showErrorSnackBar } = useSnackBarContext()
  const queryClient = useQueryClient()
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetchUser } = useAuthContext()

  const {
    mutate: postHonorStatement,
    isLoading: isPostingHonorLoading,
    isSuccess: isPostingHonorSuccess,
  } = usePostHonorStatement({
    onSuccess: async () => {
      queryClient.invalidateQueries(QueryKeys.NEXT_SUBSCRIPTION_STEP)
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
        navigateToNextScreen()
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
      fixedTopChildren={
        <Container>
          <CenteredTitle title="Les informations que tu as renseignées sont-elles correctes&nbsp;?" />
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={10} />}
          <Declaration
            text="Je déclare que l'ensemble des informations que j’ai renseignées sont correctes."
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

const Container = styled.View({ height: '100%' })
const ButtonContainer = styled.View({ paddingVertical: getSpacing(5) })
