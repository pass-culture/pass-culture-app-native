import { UseMutateFunction, RefetchOptions, QueryObserverResult } from '@tanstack/react-query'

import { ApiError } from 'api/ApiError'
import {
  SigninResponseV2,
  AccountState,
  FavoriteResponse,
  FavoriteRequest,
  RecreditType,
} from 'api/gen'
import { authStore, authActions } from 'features/auth/store/auth.store'
import { tokenActions } from 'features/auth/store/token.store'
import { FavoriteMutationContext } from 'features/favorites/queries/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { eventMonitoring } from 'libs/monitoring/services'
import { BatchProfile } from 'libs/react-native-batch'
import { storage } from 'libs/storage'

export const loginTriggeredActions = async (
  response: SigninResponseV2,
  setUserIdToCookiesChoice: (userId: number) => Promise<void>,
  resetContexts: () => void
) => {
  const user = authStore.selectors.selectUser()
  const userId = user?.id
  if (userId) {
    BatchProfile.identify(userId.toString())
    eventMonitoring.setUser({ id: userId.toString() })
    await setUserIdToCookiesChoice(userId)
  }

  tokenActions.setAccess(response.accessToken)
  eventMonitoring.setExtras({
    accessTokenExpirationDate: getTokenExpirationDate(response.accessToken),
  })
  tokenActions.setRefresh(response.refreshToken)

  authActions.setIsLoggedIn(true)

  resetContexts()
}

export const handleAccountState = async (
  accountState: AccountState,
  offerId: number | undefined,
  comeFrom: StepperOrigin | undefined,
  subsidyBonusAmount: number,
  addFavorite: UseMutateFunction<
    FavoriteResponse,
    Error | ApiError,
    FavoriteRequest,
    FavoriteMutationContext
  >,
  fetchUserProfile: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<UserProfile, Error>>,
  setErrorMessage: ((message: string) => void) | undefined
) => {
  try {
    switch (accountState) {
      case AccountState.INACTIVE:
      case AccountState.SUSPENDED:
      case AccountState.SUSPENDED_UPON_USER_REQUEST:
      case AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER:
      case AccountState.WAITING_FOR_ANONYMIZATION:
        return navigateFromRef('AccountStatusScreenHandler')
      case AccountState.DELETED:
      case AccountState.ANONYMIZED:
        return setErrorMessage?.('Ton compte à été supprimé')
      case AccountState.ACTIVE:
        await navigateForActiveState(
          offerId,
          comeFrom,
          subsidyBonusAmount,
          addFavorite,
          fetchUserProfile
        )
        return
    }
  } catch {
    setErrorMessage?.('Il y a eu un problème. Tu peux réessayer plus tard')
  }
}

const navigateForActiveState = async (
  offerId: number | undefined,
  comeFrom: StepperOrigin | undefined,
  subsidyBonusAmount: number,
  addFavorite: UseMutateFunction<
    FavoriteResponse,
    Error | ApiError,
    FavoriteRequest,
    FavoriteMutationContext
  >,
  fetchUserProfile: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<UserProfile, Error>>
) => {
  const { data: user } = await fetchUserProfile()
  const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

  if (user?.recreditAmountToShow) {
    if (
      user.recreditTypeToShow === RecreditType.BonusCredit &&
      user.recreditAmountToShow === subsidyBonusAmount
    ) {
      navigateFromRef('BonificationGranted')
    } else {
      navigateFromRef('RecreditBirthdayNotification')
    }
  } else if (!hasSeenEligibleCard && user?.showEligibleCard) {
    navigateFromRef('EighteenBirthday')
  } else if (offerId) {
    switch (comeFrom) {
      case StepperOrigin.BOOKING:
        navigateFromRef('Offer', { id: offerId, openModalOnNavigation: true })
        return
      case StepperOrigin.FAVORITE:
        addFavorite({ offerId })
        navigateFromRef('Offer', { id: offerId })
        return
      case StepperOrigin.OFFER:
      case StepperOrigin.NOTIFICATION:
        navigateFromRef('Offer', { id: offerId })
        return
      default:
        navigateToHome()
        return
    }
  } else {
    navigateToHome()
  }
}
