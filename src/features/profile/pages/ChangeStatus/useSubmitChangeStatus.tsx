import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { StatusForm } from 'features/identityCheck/pages/profile/StatusFlatList'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'

export const useSubmitChangeStatus = () => {
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()

  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
  const { control, handleSubmit, watch } = useForm<StatusForm>({
    mode: 'onChange',
    defaultValues: {
      selectedStatus: null,
    },
  })

  const selectedStatus = watch('selectedStatus')

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return

      const profile = {
        name: storedName,
        city: storedCity,
        address: storedAddress,
        status: formValues.selectedStatus,
        hasSchoolTypes: false,
        schoolType: null,
      }
      await patchProfile(profile)
      navigateToHome()
    },
    [storedName, storedCity, storedAddress, patchProfile]
  )

  return { isLoading, control, handleSubmit, selectedStatus, submitStatus }
}
