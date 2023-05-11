import { useNavigation } from '@react-navigation/native'
import { parse, format } from 'date-fns'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer, Typo } from 'ui/theme'

export function IdentityCheckValidation() {
  const { identification } = useSubscriptionContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const saveStep = useSaveStep()

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const onValidateInformation = async () => {
    analytics.logCheckEduconnectDataClicked()
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigate('Stepper')
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
