import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { StatusFlatList, StatusForm } from 'features/identityCheck/pages/profile/StatusFlatList'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const ChangeStatus = () => {
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()

  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
  const titleID = uuidv4()
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

  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Modifier mon statut" />
      <StatusFlatList
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedStatus={selectedStatus}
        submitStatus={submitStatus}
        titleID={titleID}
        control={control}
        headerHeight={headerHeight}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}
