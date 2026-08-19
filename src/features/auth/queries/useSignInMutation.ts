import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountState, FavoriteResponse, RecreditType } from 'api/gen'
import { saveLastLoginInfo } from 'features/auth/helpers/saveLastLoginInfo'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import {
  isOAuthLoginRequest,
  Provider,
  LoginRequest,
  SignInResponseFailure,
} from 'features/auth/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import {
  RootStackParamList,
  StepperOrigin,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { getSSOLoginMethod, LoginRoutineMethod, LoginType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useBonificationBonusAmount } from 'queries/settings/useSettings'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'

export const useSignInMutation = ({
  params,
  doNotNavigateOnSigninSuccess,
  analyticsMethod = 'fromLogin',
  analyticsType,
  setErrorMessage,
  onFailure,
}: {
  params: RootStackParamList['LoginMethods' | 'LoginMethodsWithLastLoginInfo' | 'SignupMethods']
  doNotNavigateOnSigninSuccess?: boolean
  analyticsMethod?: LoginRoutineMethod
  analyticsType?: LoginType
  onFailure: (error: SignInResponseFailure) => void
  setErrorMessage?: (message: string) => void
}) => {
  const enabledSaveLastLoginInfo = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_SAVE_LAST_LOGIN_INFO
  )
  const loginRoutine = useLoginRoutine()
  const onSuccess = useHandleSigninSuccess(
    params,
    doNotNavigateOnSigninSuccess,
    setErrorMessage,
    enabledSaveLastLoginInfo
  )

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const requestBody = { ...body, deviceInfo: deviceInfoStoreSelectors.selectDeviceInfo() }
      const isOAuth = isOAuthLoginRequest(requestBody)
      if (isOAuth) {
        const { provider, ...oauthBody } = requestBody
        return api.postNativeV2OauthssoProviderAuthorize(oauthBody, provider, {
          credentials: 'omit',
        })
      }
      return api.postNativeV2Signin(requestBody, { credentials: 'omit' })
    },

    onSuccess: async (response, body) => {
      const isOAuth = isOAuthLoginRequest(body)
      const loginAnalyticsType: LoginType = isOAuth ? 'SSO_login' : 'email_login'
      const ssoKind = analyticsMethod === 'fromSignup' ? 'signup' : 'login'
      const resolvedMethod: LoginRoutineMethod = isOAuth
        ? getSSOLoginMethod(body.provider, ssoKind)
        : analyticsMethod
      await loginRoutine(response, resolvedMethod, analyticsType || loginAnalyticsType)
      await onSuccess(response.accountState, isOAuth ? body.provider : Provider.EMAIL)
    },

    onError: (error, variables) => {
      const errorResponse: SignInResponseFailure = { isSuccess: false }
      if (isOAuthLoginRequest(variables)) {
        errorResponse.provider = variables.provider
      }
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
  params: RootStackParamList['LoginMethods' | 'SignupMethods'],
  doNotNavigateOnSigninSuccess?: boolean,
  setErrorMessage?: (message: string) => void,
  enabledSaveLastLoginInfo = false
) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()

  const onAddFavoriteSuccess = useCallback((data?: FavoriteResponse) => {
    if (data?.offer?.id) {
      void analytics.logHasAddedOfferToFavorites({ from: 'login', offerId: data.offer.id })
    }
  }, [])

  const { mutate: addFavorite } = useAddFavoriteMutation({
    onSuccess: onAddFavoriteSuccess,
  })

  const offerId = params?.offerId
  const comeFrom = params?.from

  const navigateForActiveState = useCallback(
    async (provider: Provider) => {
      const user = await api.getNativeV1Me()

      if (user?.email && enabledSaveLastLoginInfo) {
        await saveLastLoginInfo({ email: user.email, provider })
      }

      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

      if (user?.recreditAmountToShow) {
        if (
          user.recreditTypeToShow === RecreditType.BonusCredit &&
          user.recreditAmountToShow === bonificationBonusAmount
        ) {
          navigate('BonificationGranted')
        } else {
          navigate('RecreditBirthdayNotification')
        }
      } else if (!hasSeenEligibleCard && user.showEligibleCard) {
        navigate('EighteenBirthday')
      } else if (offerId) {
        switch (comeFrom) {
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
    },
    [enabledSaveLastLoginInfo, offerId, bonificationBonusAmount, navigate, comeFrom, addFavorite]
  )

  return useCallback(
    async (accountState: AccountState, provider: Provider) => {
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
            await navigateForActiveState(provider)
            return
        }
      } catch {
        setErrorMessage?.('Il y a eu un problème. Tu peux réessayer plus tard')
      }
    },
    [doNotNavigateOnSigninSuccess, navigate, navigateForActiveState, setErrorMessage]
  )
}
