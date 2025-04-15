import { yupResolver } from '@hookform/resolvers/yup'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'

import { usePostProfile } from 'features/identityCheck/api/usePostProfile'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
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

type Props = StackScreenProps<SubscriptionRootStackParamList, 'SetStatus'>

export const SetStatus: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type
  const isIdentityCheck = type === ProfileTypes.IDENTITY_CHECK
  const title = isIdentityCheck ? 'Profil' : 'Informations personnelles'

  const saveStep = useSaveStep()
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()

  const { mutateAsync: postProfile } = usePostProfile()
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
      await postProfile(profile)
      await saveStep(IdentityCheckStep.PROFILE)
      setIsLoading(false)
      navigateForwardToStepper()
    },
    [storedName, storedCity, storedAddress, postProfile, saveStep, navigateForwardToStepper]
  )

  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={title} />
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
