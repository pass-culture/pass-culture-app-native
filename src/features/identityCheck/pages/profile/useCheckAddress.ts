import { useNavigation, useRoute } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { hasCompletedCreditActivation } from 'features/identityCheck/helpers/hasCompletedCreditActivation'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { handlePostProfileSuccess } from 'features/identityCheck/queries/profileSubmissionHandlers'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { usePostHonorStatementMutation } from 'features/identityCheck/queries/usePostHonorStatementMutation'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { QueryKeys } from 'libs/queryKeys'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { hasOngoingCredit } from 'shared/user/getAvailableCredit'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export function useCheckAddress() {
  const { params } = useRoute<UseRouteType<'CheckAddress'>>()
  const { user, refetchUser } = useAuthContext()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const { data } = useGetStepperInfoQuery()
  const [isValidating, setIsValidating] = useState(false)
  const queryClient = useQueryClient()
  const saveStep = useSaveStep()
  const { navigate, reset } = useNavigation<UseNavigationType>()
  const underageIdentityCheckUbbleDMS =
    data?.underageOkIdentityCheckMethod === 'ubble' || data?.underageOkIdentityCheckMethod === 'dms'
  const underageIdentityCheckEduconnect = data?.underageOkIdentityCheckMethod === 'educonnect'
  const shouldSubmitProfile = underageIdentityCheckUbbleDMS || underageIdentityCheckEduconnect

  const checkBeneficiaryCredit = async () => {
    void queryClient.invalidateQueries({ queryKey: [QueryKeys.HOME_BANNER] })

    let result
    try {
      result = await refetchUser()
    } catch (error) {
      showErrorSnackBar(extractApiErrorMessage(error))
      return
    }

    if (result.isError) {
      showErrorSnackBar(extractApiErrorMessage(result.error))
      return
    }
    if (!result.data) {
      showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
      return
    }

    const updatedUser = result.data
    const hasEighteenCredit =
      hasCompletedCreditActivation(updatedUser) &&
      isCurrentBeneficiary(updatedUser) &&
      hasOngoingCredit(updatedUser) &&
      [
        UserCreditType.CREDIT_V1_18,
        UserCreditType.CREDIT_V2_18,
        UserCreditType.CREDIT_V3_18,
      ].includes(updatedUser.creditType)

    resetProfileStores()
    if (hasEighteenCredit) {
      const [navigator, screenConfig] = getSubscriptionHookConfig('BeneficiaryAccountCreated', {
        from: 'CheckAddress',
      })
      navigate(navigator, { ...screenConfig, params: { from: 'CheckAddress' } })
    } else {
      await saveStep(IdentityCheckStep.CONFIRMATION)
      navigate(...getSubscriptionHookConfig('BeneficiaryRequestSent'))
    }
  }

  const { mutateAsync: patchProfile } = usePatchProfileMutation({})
  const { mutateAsync: postProfile } = usePostProfileMutation({})
  const { mutateAsync: postHonorStatement } = usePostHonorStatementMutation({})

  const onValidate = async () => {
    if (isValidating) return

    if (!user || !user.city || !user.postalCode || !user.street) {
      showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
      return
    }

    if (shouldSubmitProfile && (!user.firstName || !user.lastName || !user.activityId)) {
      showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
      return
    }

    setIsValidating(true)
    try {
      await patchProfile({
        city: user.city,
        postalCode: user.postalCode,
        address: user.street,
      })

      if (shouldSubmitProfile) {
        await postProfile({
          name:
            user.firstName && user.lastName
              ? { firstName: user.firstName, lastName: user.lastName }
              : null,
          city: { name: user.city, postalCode: user.postalCode, code: '', departementCode: '' },
          address: user.street,
          status: user.activityId ?? null,
          hasSchoolTypes: false,
          schoolType: null,
        })
      }
      await saveStep(IdentityCheckStep.PROFILE)
      if (underageIdentityCheckUbbleDMS) {
        await postHonorStatement()
        await checkBeneficiaryCredit()
        return
      }

      handlePostProfileSuccess({
        isBookingFreeOffer: false,
        navigateForwardToStepper,
        reset,
        refetchUser,
      })
    } catch (error) {
      showErrorSnackBar(extractApiErrorMessage(error))
    } finally {
      setIsValidating(false)
    }
  }

  const onPressModify = () =>
    navigate(
      ...getProfileHookConfig('ChangeCity', {
        type: PersonalDataTypes.CHECK_ADDRESS_DATA,
      })
    )

  return {
    address: user?.street,
    city: `${user?.postalCode}, ${user?.city}`,
    summaryTitle: params?.fromChangeAddress
      ? 'Vérifie que ces informations sont correctes avant de continuer'
      : 'Habites-tu toujours à cette adresse\u00a0?',
    onValidate,
    isLoading: isValidating,
    onPressModify,
    honorStatement: underageIdentityCheckUbbleDMS,
  }
}
