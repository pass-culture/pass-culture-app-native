import { yupResolver } from '@hookform/resolvers/yup'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'

import { usePostProfile } from 'features/identityCheck/api/usePostProfile'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { analytics } from 'libs/analytics/provider'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

import { StatusFlatList, StatusForm } from './StatusFlatList'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})
export const SetStatus = () => {
  const saveStep = useSaveStep()
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()

  const { mutateAsync: patchProfile } = usePostProfile()
  // isLoading from react-query is not support with mutateAsync
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const titleID = uuidv4()
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid: formIsValid },
  } = useForm<StatusForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const selectedStatus = watch('selectedStatus')

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return
      analytics.logSetStatusClicked()

      const profile = {
        name: storedName,
        city: storedCity,
        address: storedAddress,
        status: formValues.selectedStatus,
        hasSchoolTypes: false,
        schoolType: null,
      }
      setIsLoading(true)
      await patchProfile(profile)
      await saveStep(IdentityCheckStep.PROFILE)
      setIsLoading(false)
      navigateForwardToStepper()
    },
    [storedName, storedCity, storedAddress, patchProfile, saveStep, navigateForwardToStepper]
  )

  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Profil" />
      <StatusFlatList
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedStatus={selectedStatus}
        submitStatus={submitStatus}
        titleID={titleID}
        control={control}
        headerHeight={headerHeight}
        formIsValid={formIsValid}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}
