import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { StatusForm } from 'features/identityCheck/pages/profile/StatusFlatList'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})

export const useSubmitChangeStatus = () => {
  const { params } = useRoute<UseRouteType<'ChangeStatus'>>()
  const type = params?.type
  const isMandatoryUpdatePersonalData = type === PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA
  const successSnackBarMessage = isMandatoryUpdatePersonalData
    ? 'Tes informations ont bien été modifiés\u00a0!'
    : 'Ton statut a bien été modifié\u00a0!'

  const { user } = useAuthContext()
  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const storedStatus = useStatus()
  const [navigatorName, screenConfig] = getProfileHookConfig('UpdatePersonalDataConfirmation')

  const { mutate: patchProfile, isLoading } = usePatchProfileMutation({
    onSuccess: (_, variables) => {
      if (isMandatoryUpdatePersonalData) {
        reset({
          index: 1,
          routes: [
            { name: homeNavigationConfig[0], params: homeNavigationConfig[1] },
            { name: navigatorName, params: screenConfig },
          ],
        })
      } else {
        navigate(...getProfileHookConfig('PersonalData'))
        showSuccessSnackBar({
          message: successSnackBarMessage,
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
      analytics.logUpdateStatus({
        oldStatus: user?.activityId ?? '',
        newStatus: variables.activityId ?? '',
      })
    },

    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid: formIsValid },
  } = useForm<StatusForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { selectedStatus: storedStatus ?? user?.activityId ?? undefined },
  })

  const selectedStatus = watch('selectedStatus')

  const submitStatus = useCallback(
    async (formValues: StatusForm) => patchProfile({ activityId: formValues.selectedStatus }),
    [patchProfile]
  )

  return { isLoading, control, handleSubmit, selectedStatus, submitStatus, formIsValid }
}
