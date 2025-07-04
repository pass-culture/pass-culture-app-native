import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { statusActions, useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import {
  handlePostProfileError,
  handlePostProfileSuccess,
} from 'features/identityCheck/queries/profileSubmissionHandlers'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFreeOfferId } from 'features/offer/store/freeOfferIdStore'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { StatusFlatList, StatusForm } from './StatusFlatList'

const schema = yup.object().shape({
  selectedStatus: yup.string().required(),
})

export const SetStatus = () => {
  const { params } = useRoute<UseRouteType<'SetStatus'>>()
  const { reset } = useNavigation<UseNavigationType>()
  const { refetchUser } = useAuthContext()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const { showErrorSnackBar } = useSnackBarContext()
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const type = params?.type
  const isIdentityCheck = type === ProfileTypes.IDENTITY_CHECK
  const isBookingFreeOffer = type === ProfileTypes.BOOKING_FREE_OFFER_15_16
  const title = isIdentityCheck ? 'Profil' : 'Informations personnelles'

  const saveStep = useSaveStep()
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()
  const storedStatus = useStatus()
  const { setStatus: setStoreStatus } = statusActions
  const storedFreeOfferId = useFreeOfferId()

  const { mutateAsync: postProfile } = usePostProfileMutation({
    onSuccess: () =>
      handlePostProfileSuccess({
        isBookingFreeOffer,
        enableBookingFreeOfferFifteenSixteen,
        storedFreeOfferId,
        navigateForwardToStepper,
        reset,
        refetchUser,
      }),
    onError: () =>
      handlePostProfileError({
        isBookingFreeOffer,
        enableBookingFreeOfferFifteenSixteen,
        storedFreeOfferId,
        reset,
        showErrorSnackBar,
        SNACK_BAR_TIME_OUT,
      }),
  })

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
    },
    [postProfile, saveStep, storedAddress, storedCity, storedName]
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
