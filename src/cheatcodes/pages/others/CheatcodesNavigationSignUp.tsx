import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { useSomeOfferIdQuery } from 'cheatcodes/queries/useSomeOfferIdQuery'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'

type VisibleModal =
  | 'finishSubscription'
  | 'authentication'
  | 'applicationProcessing'
  | 'errorApplication'
  | null

const signUpCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'SignUp 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationSignUp' },
  },
  subscreens: [
    { id: uuidv4(), title: 'AccountCreated', navigationTarget: { screen: 'AccountCreated' } },
    {
      id: uuidv4(),
      title: 'BeneficiaryAccountCreated',
      navigationTarget: getSubscriptionPropConfig('BeneficiaryAccountCreated'),
    },
    {
      id: uuidv4(),
      title: 'SignupConfirmationExpiredLink',
      navigationTarget: {
        screen: 'SignupConfirmationExpiredLink',
        params: { email: 'john@wick.com' },
      },
    },
    {
      id: uuidv4(),
      title: 'NotYetUnderageEligibility',
      navigationTarget: {
        screen: 'NotYetUnderageEligibility',
        params: { eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString() },
      },
    },
    {
      id: uuidv4(),
      title: 'AfterSignupEmailValidationBuffer',
      navigationTarget: {
        screen: 'AfterSignupEmailValidationBuffer',
        params: {
          token: 'whichTokenDoYouWantReally',
          expiration_timestamp: 456789123,
          email: 'john@wick.com',
        },
      },
    },
    { id: uuidv4(), title: 'FinishSubscriptionModal', showOnlyInSearch: true },
    { id: uuidv4(), title: 'AuthenticationModal', showOnlyInSearch: true },
    { id: uuidv4(), title: 'ApplicationProcessingModal', showOnlyInSearch: true },
    { id: uuidv4(), title: 'ErrorApplicationModal', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationSignUpButtons: CheatcodeCategory[] = [signUpCheatcodeCategory]

export function CheatcodesNavigationSignUp(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))
  const offerId = useSomeOfferIdQuery()
  const [visibleModal, setVisibleModal] = useState<VisibleModal>(null)

  const visibleSubscreens = signUpCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={signUpCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        button={{
          id: 'finish-sub-action',
          title: 'FinishSubscriptionModal',
          onPress: () => setVisibleModal('finishSubscription'),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'auth-action',
          title: 'AuthenticationModal',
          onPress: () => setVisibleModal('authentication'),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'app-processing-action',
          title: 'ApplicationProcessingModal',
          onPress: () => setVisibleModal('applicationProcessing'),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'error-app-action',
          title: 'ErrorApplicationModal',
          onPress: () => setVisibleModal('errorApplication'),
        }}
        variant="secondary"
      />

      <FinishSubscriptionModal
        visible={visibleModal === 'finishSubscription'}
        hideModal={() => setVisibleModal(null)}
        from={StepperOrigin.OFFER}
      />
      <AuthenticationModal
        visible={visibleModal === 'authentication'}
        hideModal={() => setVisibleModal(null)}
        offerId={offerId}
        from={StepperOrigin.FAVORITE}
      />
      <ApplicationProcessingModal
        visible={visibleModal === 'applicationProcessing'}
        hideModal={() => setVisibleModal(null)}
        offerId={offerId}
      />
      <ErrorApplicationModal
        visible={visibleModal === 'errorApplication'}
        hideModal={() => setVisibleModal(null)}
        offerId={offerId}
      />
    </CheatcodesTemplateScreen>
  )
}
