import { useFocusEffect, useRoute } from '@react-navigation/native'
import { parse, format } from 'date-fns'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { logoutFromEduConnectIfAllowed } from 'features/identityCheck/api/logoutFromEduConnectIfAllowed'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { invalidateStepperInfoQuery } from 'features/identityCheck/pages/helpers/invalidateStepperQuery'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function EduConnectValidation() {
  const { params } = useRoute<UseRouteType<'EduConnectValidation'>>()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const { dispatch, identification } = useSubscriptionContext()

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const navigateToNextEduConnectStep = () => {
    const logoutUrl = params.logoutUrl
    logoutFromEduConnectIfAllowed(logoutUrl)
    dispatch({ type: 'SET_STEP', payload: DeprecatedIdentityCheckStep.CONFIRMATION })
    // in web context, we are redirected to this page after educonnect login in a new tab.
    // Therefore, the identity check context loses the state before educonnect login and we
    // cannot use navigateToNextScreen here. We need to navigated explicitly to next page.
    invalidateStepperInfoQuery()
    navigateForwardToStepper()
  }

  useFocusEffect(
    useCallback(() => {
      dispatch({
        type: 'SET_IDENTIFICATION',
        payload: {
          firstName: params.firstName ?? null,
          lastName: params.lastName ?? null,
          birthDate: params.dateOfBirth ?? null,
        },
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])
  )

  useEnterKeyAction(navigateToNextEduConnectStep)

  return (
    <PageWithHeader
      title="Mon identité"
      scrollChildren={
        <React.Fragment>
          <CenteredTitle title="Les informations extraites sont-elles correctes&nbsp;?" />
          <BodyContainer>
            <Spacer.Column numberOfSpaces={6} />
            <StyledBody>Ton prénom</StyledBody>
            <Spacer.Column numberOfSpaces={2} />
            <TextToValidate testID="validation-first-name">
              {identification.firstName}
            </TextToValidate>
            <Spacer.Column numberOfSpaces={5} />
            <StyledBody>Ton nom de famille</StyledBody>
            <Spacer.Column numberOfSpaces={2} />
            <TextToValidate testID="validation-name">{identification.lastName}</TextToValidate>
            <Spacer.Column numberOfSpaces={5} />
            <StyledBody>Ta date de naissance</StyledBody>
            <Spacer.Column numberOfSpaces={2} />
            <TextToValidate testID="validation-birth-date">{birthDate}</TextToValidate>
          </BodyContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Valider mes informations"
          onPress={navigateToNextEduConnectStep}
        />
      }
    />
  )
}

const BodyContainer = styled.View({
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const TextToValidate = styled(Typo.Title3).attrs(getNoHeadingAttrs())``
