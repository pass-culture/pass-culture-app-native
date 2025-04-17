import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { StatusForm } from 'features/identityCheck/pages/profile/StatusFlatList'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})

export const useSubmitChangeStatus = () => {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { mutate: patchProfile, isLoading } = usePatchProfileMutation({
    onSuccess: (_, variables) => {
      analytics.logUpdateStatus({
        oldStatus: user?.activityId ?? '',
        newStatus: variables.activityId ?? '',
      })
      showSuccessSnackBar({
        message: 'Ton statut a bien été modifié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
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
  })

  const selectedStatus = watch('selectedStatus')

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      patchProfile({ activityId: formValues.selectedStatus })
      navigate(...getProfileStackConfig('PersonalData'))
    },
    [navigate, patchProfile]
  )

  return { isLoading, control, handleSubmit, selectedStatus, submitStatus, formIsValid }
}
