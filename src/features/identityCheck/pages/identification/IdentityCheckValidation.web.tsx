import { t } from '@lingui/macro'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native'
import moment from 'moment'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function IdentityCheckValidation() {
  const { params } = useRoute<UseRouteType<'IdentityCheckValidation'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const { dispatch, identification } = useIdentityCheckContext()

  const birthDate = identification.birthDate
    ? moment(identification.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : ''

  const navigateToNextEduConnectStep = () => {
    dispatch({ type: 'SET_STEP', payload: IdentityCheckStep.CONFIRMATION })
    // Here we do not call navigateToNextScreen but navigate directly to the next screen
    // This is possible because we are the last step of the flow profile.
    // This is because this component may not be in useIdentityCheckSteps, but we can arrive here
    // on web by being redirected by the backend from educonnect. See:
    // https://github.com/pass-culture/pass-culture-main/blob/master/api/src/pcapi/routes/saml/educonnect.py#L161
    // TODO(antoinewg): once the backend redirects to `validation`, use navigateToNextScreen and delete route
    navigate('IdentityCheckStepper')
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
    }, [params])
  )

  useEnterKeyAction(navigateToNextEduConnectStep)

  return (
    <PageWithHeader
      title={t`Mon identité`}
      fixedTopChildren={
        <CenteredTitle title={t`Les informations extraites sont-elles correctes\u00a0?`} />
      }
      scrollChildren={
        <BodyContainer>
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ton prénom`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-first-name">{identification.firstName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ton nom de famille`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-name">{identification.lastName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ta date de naissance`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-birth-date">{birthDate}</Typo.Title3>
        </BodyContainer>
      }
      fixedBottomChildren={
        <ButtonPrimary title={t`Valider mes informations`} onPress={navigateToNextEduConnectStep} />
      }
    />
  )
}

const BodyContainer = styled.View({
  alignItems: 'center',
})
