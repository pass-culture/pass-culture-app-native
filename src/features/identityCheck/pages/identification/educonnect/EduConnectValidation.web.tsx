import { useFocusEffect, useRoute } from '@react-navigation/native'
import { parse, format } from 'date-fns'
import React, { useCallback } from 'react'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { logoutFromEduConnectIfAllowed } from 'features/identityCheck/helpers/logoutFromEduConnectIfAllowed'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { invalidateStepperInfoQueries } from 'features/identityCheck/pages/helpers/invalidateStepperQueries'
import { EduconnectValidationPage } from 'features/identityCheck/pages/identification/educonnect/EduconnectValidationPage'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'

export function EduConnectValidation() {
  const { params } = useRoute<UseRouteType<'EduConnectValidation'>>()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const { dispatch, identification } = useSubscriptionContext()

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const navigateToNextEduConnectStep = () => {
    const logoutUrl = params?.logoutUrl
    logoutFromEduConnectIfAllowed(logoutUrl)
    dispatch({ type: 'SET_STEP', payload: DeprecatedIdentityCheckStep.CONFIRMATION })
    // in web context, we are redirected to this page after educonnect login in a new tab.
    // Therefore, the identity check context loses the state before educonnect login and we
    // cannot use navigateToNextScreen here. We need to navigated explicitly to next page.
    invalidateStepperInfoQueries()
    navigateForwardToStepper()
  }

  useFocusEffect(
    useCallback(() => {
      dispatch({
        type: 'SET_IDENTIFICATION',
        payload: {
          firstName: params?.firstName ?? null,
          lastName: params?.lastName ?? null,
          birthDate: params?.dateOfBirth ?? null,
        },
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])
  )

  useEnterKeyAction(navigateToNextEduConnectStep)

  return (
    <EduconnectValidationPage
      birthDate={birthDate}
      firstName={identification.firstName}
      lastName={identification.lastName}
      onValidate={navigateToNextEduConnectStep}
    />
  )
}
