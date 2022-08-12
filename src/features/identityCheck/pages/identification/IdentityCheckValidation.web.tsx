import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { parse, format } from 'date-fns'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { logoutFromEduConnectIfAllowed } from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function IdentityCheckValidation() {
  const { params } = useRoute<UseRouteType<'IdentityCheckValidation'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const { dispatch, identification } = useIdentityCheckContext()

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const navigateToNextEduConnectStep = () => {
    const logoutUrl = params.logoutUrl
    logoutFromEduConnectIfAllowed(logoutUrl)
    dispatch({ type: 'SET_STEP', payload: IdentityCheckStep.CONFIRMATION })
    // in web context, we are redirected to this page after educonnect login in a new tab.
    // Therefore, the identity check context loses the state before educonnect login and we
    // cannot use navigateToNextScreen here. We need to navigated explicitely to next page.
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Body>{t`Ton prénom`}</Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextToValidate testID="validation-first-name">{identification.firstName}</TextToValidate>
          <Spacer.Column numberOfSpaces={5} />
          <Body>{t`Ton nom de famille`}</Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextToValidate testID="validation-name">{identification.lastName}</TextToValidate>
          <Spacer.Column numberOfSpaces={5} />
          <Body>{t`Ta date de naissance`}</Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextToValidate testID="validation-birth-date">{birthDate}</TextToValidate>
        </BodyContainer>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording={t`Valider mes informations`}
          onPress={navigateToNextEduConnectStep}
        />
      }
    />
  )
}

const BodyContainer = styled.View({
  alignItems: 'center',
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const TextToValidate = styled(Typo.Title3).attrs(getNoHeadingAttrs())``
