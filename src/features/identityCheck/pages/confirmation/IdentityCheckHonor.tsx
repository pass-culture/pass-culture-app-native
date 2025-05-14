import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { usePostHonorStatement } from 'features/identityCheck/api/usePostHonorStatement'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { QueryKeys } from 'libs/queryKeys'
import { hasOngoingCredit } from 'shared/user/useAvailableCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const IdentityCheckHonor = () => {
  const headerHeight = useGetHeaderHeight()
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
    <StyledScrollView>
      <HeaderHeightSpacer headerHeight={headerHeight} />
      <Typo.Title2 {...getHeadingAttrs(1)}>
        Les informations que tu as renseignées sont-elles correctes&nbsp;?
      </Typo.Title2>
      <Spacer.Column numberOfSpaces={10} />
      <Typo.Title4 {...getHeadingAttrs(2)}>
        &quot;Je déclare que l’ensemble des informations que j’ai renseignées durant mon inscription
        sont correctes.&quot;
      </Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni.
        En cas de fraude, des poursuites judiciaires pourraient être engagées.
      </StyledBody>
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimary
        type="submit"
        onPress={postHonorStatement}
        wording="Valider et continuer"
        isLoading={isSubmitButtonEnabled}
      />
      <Spacer.Column numberOfSpaces={5} />
      <Spacer.BottomScreen />
    </StyledScrollView>
  )
}

const StyledScrollView = styled(ScrollView).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const HeaderHeightSpacer = styled.View.attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  paddingTop: headerHeight,
}))

const StyledBody = styled(Typo.BodyS)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
