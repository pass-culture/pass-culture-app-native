import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { StatusForm } from 'features/identityCheck/pages/profile/StatusFlatList'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})

export const useSubmitChangeStatus = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { mutate: patchProfile, isLoading } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Ton statut a bien été modifié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  )
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
      navigate('PersonalData')
    },
    [navigate, patchProfile]
  )

  return { isLoading, control, handleSubmit, selectedStatus, submitStatus, formIsValid }
}
