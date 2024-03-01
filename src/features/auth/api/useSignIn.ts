import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountState, FavoriteResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { LoginRequest, SignInResponseFailure } from 'features/auth/types'
import { useAddFavorite } from 'features/favorites/api'
import { navigateToHome } from 'features/navigation/helpers'
import {
  RootStackParamList,
  StepperOrigin,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics'
import { LoginRoutineMethod, SSOType } from 'libs/analytics/logEventAnalytics'
import { storage } from 'libs/storage'
import { shouldShowCulturalSurvey } from 'shared/culturalSurvey/shouldShowCulturalSurvey'

export const useSignIn = ({
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

  return useMutation(
    async (body: LoginRequest) => {
      const requestBody = { ...body, deviceInfo }
      if ('authorizationCode' in requestBody) {
        return api.postNativeV1OauthGoogleAuthorize(requestBody)
      }
      return api.postNativeV1Signin(requestBody, { credentials: 'omit' })
    },
    {
      onSuccess: async (response) => {
        await loginRoutine(response, analyticsMethod, analyticsType)
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
    }
  )
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

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: onAddFavoriteSuccess,
  })

  const offerId = params?.offerId

  return useCallback(
    async (accountState: AccountState) => {
      try {
        if (doNotNavigateOnSigninSuccess) {
          return
        }
        if (accountState !== AccountState.ACTIVE) {
          return navigate('SuspensionScreen')
        }

        const user = await api.getNativeV1Me()
        const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

        if (user?.recreditAmountToShow) {
          navigate('RecreditBirthdayNotification')
        } else if (!hasSeenEligibleCard && user.showEligibleCard) {
          navigate('EighteenBirthday')
        } else if (shouldShowCulturalSurvey(user)) {
          navigate('CulturalSurveyIntro')
        } else if (offerId) {
          switch (params.from) {
            case StepperOrigin.BOOKING:
              navigate('Offer', { id: offerId, openModalOnNavigation: true })
              return

            case StepperOrigin.FAVORITE:
              addFavorite({ offerId })
              navigate('Offer', { id: offerId })
              return
          }
        } else {
          navigateToHome()
        }
      } catch {
        setErrorMessage?.('Il y a eu un problème. Tu peux réessayer plus tard')
      }
    },
    [offerId, navigate, doNotNavigateOnSigninSuccess, setErrorMessage, params?.from, addFavorite]
  )
}
