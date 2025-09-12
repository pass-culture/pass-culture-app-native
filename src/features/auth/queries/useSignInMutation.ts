import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountState, FavoriteResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { LoginRequest, SignInResponseFailure } from 'features/auth/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import {
  RootStackParamList,
  StepperOrigin,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { LoginRoutineMethod, SSOType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'

export const useSignInMutation = ({
  params,
  doNotNavigateOnSigninSuccess,
  analyticsMethod = 'fromLogin',
  analyticsType,
  setErrorMessage,
  onFailure,
}: {
  params: RootStackParamList['Login' | 'SignupForm']
  doNotNavigateOnSigninSuccess?: boolean
  analyticsMethod?: LoginRoutineMethod
  analyticsType?: SSOType
  onFailure: (error: SignInResponseFailure) => void
  setErrorMessage?: (message: string) => void
}) => {
  const loginRoutine = useLoginRoutine()
  const onSuccess = useHandleSigninSuccess(params, doNotNavigateOnSigninSuccess, setErrorMessage)
  const deviceInfo = useDeviceInfo()

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const requestBody = { ...body, deviceInfo }
      if ('authorizationCode' in requestBody) {
        return api.postNativeV1OauthGoogleAuthorize(requestBody)
      }
      return api.postNativeV1Signin(requestBody, { credentials: 'omit' })
    },

    onSuccess: async (response, body) => {
      const loginAnalyticsType = 'authorizationCode' in body ? 'SSO_login' : undefined
      await loginRoutine(response, analyticsMethod, analyticsType || loginAnalyticsType)
      onSuccess(response.accountState)
    },

    onError: (error) => {
      const errorResponse: SignInResponseFailure = { isSuccess: false }
      if (isApiError(error)) {
        errorResponse.statusCode = error.statusCode
        errorResponse.content = error.content
      } else {
        errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
      }
      onFailure(errorResponse)
    },
  })
}

const useHandleSigninSuccess = (
  params?: RootStackParamList['Login' | 'SignupForm'],
  doNotNavigateOnSigninSuccess?: boolean,
  setErrorMessage?: (message: string) => void
) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const onAddFavoriteSuccess = useCallback((data?: FavoriteResponse) => {
    if (data?.offer?.id) {
      analytics.logHasAddedOfferToFavorites({ from: 'login', offerId: data.offer.id })
    }
  }, [])

  const { mutate: addFavorite } = useAddFavoriteMutation({
    onSuccess: onAddFavoriteSuccess,
  })

  const offerId = params?.offerId

  const navigateForActiveState = useCallback(async () => {
    const user = await api.getNativeV1Me()
    const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

    if (user?.recreditAmountToShow) {
      navigate('RecreditBirthdayNotification')
    } else if (!hasSeenEligibleCard && user.showEligibleCard) {
      navigate('EighteenBirthday')
    } else if (offerId) {
      switch (params.from) {
        case StepperOrigin.BOOKING:
          navigate('Offer', { id: offerId, openModalOnNavigation: true })
          return
        case StepperOrigin.FAVORITE:
          addFavorite({ offerId })
          navigate('Offer', { id: offerId })
          return
        case StepperOrigin.OFFER:
        case StepperOrigin.NOTIFICATION:
          navigate('Offer', { id: offerId })
          return
        default:
          navigateToHome()
          return
      }
    } else {
      navigateToHome()
    }
  }, [addFavorite, navigate, offerId, params?.from])

  return useCallback(
    async (accountState: AccountState) => {
      try {
        if (doNotNavigateOnSigninSuccess) {
          return
        }
        switch (accountState) {
          case AccountState.INACTIVE:
          case AccountState.SUSPENDED:
          case AccountState.SUSPENDED_UPON_USER_REQUEST:
          case AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER:
          case AccountState.WAITING_FOR_ANONYMIZATION:
            return navigate('AccountStatusScreenHandler')
          case AccountState.DELETED:
          case AccountState.ANONYMIZED:
            return setErrorMessage?.('Ton compte à été supprimé')
          case AccountState.ACTIVE:
            navigateForActiveState()
            return
        }
      } catch {
        setErrorMessage?.('Il y a eu un problème. Tu peux réessayer plus tard')
      }
    },
    [doNotNavigateOnSigninSuccess, navigate, navigateForActiveState, setErrorMessage]
  )
}
