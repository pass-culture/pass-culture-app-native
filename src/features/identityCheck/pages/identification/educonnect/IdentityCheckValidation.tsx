import { useNavigation } from '@react-navigation/native'
import { parse, format } from 'date-fns'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { invalidateStepperInfoQuery } from 'features/identityCheck/pages/helpers/invalidateStepperQuery'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer, Typo } from 'ui/theme'

export function IdentityCheckValidation() {
  const { dispatch, identification } = useSubscriptionContext()
  const { navigate } = useNavigation<UseNavigationType>()

  const saveCheckpoint = async () => {
    try {
      await queryClient.invalidateQueries([QueryKeys.NEXT_SUBSCRIPTION_STEP])
      invalidateStepperInfoQuery()
      dispatch({ type: 'SET_STEP', payload: DeprecatedIdentityCheckStep.CONFIRMATION })
    } catch (error) {
      eventMonitoring.captureException(error)
    }
  }

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const navigateToNextEduConnectStep = async () => {
    saveCheckpoint()
    navigate('IdentityCheckStepper')
  }

  const onValidateInformation = async () => {
    amplitude.logEvent('check_Educonnect_data_clicked')
    await navigateToNextEduConnectStep()
  }

  return (
    <PageWithHeader
      title="Mon identité"
      fixedTopChildren={
        <CenteredTitle title="Les informations extraites sont-elles correctes&nbsp;?" />
      }
      scrollChildren={
        <BodyContainer>
          <StyledBody>Ton prénom</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-first-name">{identification.firstName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>Ton nom de famille</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-name">{identification.lastName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>Ta date de naissance</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-birth-date">{birthDate}</Typo.Title3>
        </BodyContainer>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Valider mes informations"
          onPress={onValidateInformation}
        />
      }
    />
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const BodyContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
