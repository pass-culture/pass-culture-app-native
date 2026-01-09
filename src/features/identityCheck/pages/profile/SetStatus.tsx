import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { statusActions, useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

import { StatusFlatList, StatusForm } from './StatusFlatList'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})

export const SetStatus = () => {
  const { params } = useRoute<UseRouteType<'SetStatus'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario

  const identityCheckAndRecapExistingDataConfig = 'Profil'
  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: identityCheckAndRecapExistingDataConfig,
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: 'Informations personnelles',
    [ProfileTypes.RECAP_EXISTING_DATA]: identityCheckAndRecapExistingDataConfig,
  }

  const storedStatus = useStatus()
  const { setStatus: setStoreStatus } = statusActions

  // isLoading from react-query is not support with mutateAsync
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const titleID = uuidv4()
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid: formIsValid },
  } = useForm<StatusForm>({
    defaultValues: { selectedStatus: storedStatus ?? undefined },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const selectedStatus = watch('selectedStatus')

  useEffect(() => {
    if (selectedStatus) setStoreStatus(selectedStatus)
  }, [selectedStatus, setStoreStatus])

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return
      setIsLoading(true)
      setStoreStatus(formValues.selectedStatus)
      navigate(...getSubscriptionHookConfig('ActivationProfileRecap', { type }))
      setIsLoading(false)
    },
    [navigate, setStoreStatus, type]
  )

  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={pageConfigByType[type]} />
      <StatusFlatList
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        submitStatus={submitStatus}
        isChangeStatus={false}
        titleID={titleID}
        control={control}
        headerHeight={headerHeight}
        formIsValid={formIsValid}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}
