import { t } from '@lingui/macro'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'

export function IdentityCheckValidation() {
  const { dispatch, identification } = useIdentityCheckContext()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const birthDate = identification.birthDate
    ? moment(identification.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : ''

  const navigateToNextEduConnectStep = async () => {
    dispatch({ type: 'SET_STEP', payload: IdentityCheckStep.CONFIRMATION })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Mon identité`}
      fixedTopChildren={
        <CenteredTitle title={t`Les informations extraites sont-elles correctes\u00a0?`} />
      }
      scrollChildren={
        <BodyContainer>
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
  justifyContent: 'center',
  flex: 1,
})
