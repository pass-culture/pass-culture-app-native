import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useShowDisableActivation } from 'features/forceUpdate/helpers/useShowDisableActivation'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useFunctionOnce } from 'libs/hooks'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { GenericOfficialPage } from 'ui/pages/GenericOfficialPage'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'

export const VerifyEligibility: FunctionComponent = () => {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewVerifyEligibility)
  }, [])

  useShowDisableActivation()

  const triggerBatch = useFunctionOnce(() =>
    BatchProfile.trackEvent(BatchEvent.hasValidatedEligibleAccount)
  )

  return (
    <GenericOfficialPage
      title="Vérifie ton identité pour débloquer ton crédit"
      buttons={[
        <InternalTouchableLink
          key={1}
          as={Button}
          wording="Commencer la vérification"
          navigateTo={getSubscriptionPropConfig('Stepper', {
            from: StepperOrigin.VERIFY_ELIGIBILITY,
          })}
        />,
        <InternalTouchableLink
          key={2}
          as={Button}
          variant="tertiary"
          color="neutral"
          icon={PlainArrowNext}
          wording="Vérifier mon identité plus tard"
          navigateTo={navigateToHomeConfig}
          onBeforeNavigate={triggerBatch}
        />,
      ]}>
      <View>
        <StyledBody>
          Nous avons besoin de vérifier ton identité. Si tu es éligible tu pourras bénéficier de
          l’aide financière de l’État.
        </StyledBody>
        <Typo.BodyAccent>
          Assure-toi que toutes les informations que tu nous transmets sont correctes pour faciliter
          ton inscription.
        </Typo.BodyAccent>
      </View>
    </GenericOfficialPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginBottom: theme.designSystem.size.spacing.l,
}))
