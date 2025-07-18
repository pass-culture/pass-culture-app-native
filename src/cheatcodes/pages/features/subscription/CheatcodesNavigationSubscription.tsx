import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { SubscriptionSuccessModal } from 'features/subscription/components/modals/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { SubscriptionTheme } from 'features/subscription/types'

type VisibleModal = SubscriptionTheme | 'unsubscribing' | 'onboarding' | null

const subscriptionCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Subscription 🔔',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationSubscription' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'OnboardingSubscription',
      navigationTarget: { screen: 'OnboardingSubscription' },
    },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Cinéma', showOnlyInSearch: true },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Lecture', showOnlyInSearch: true },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Musique', showOnlyInSearch: true },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Spectacles', showOnlyInSearch: true },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Visites', showOnlyInSearch: true },
    { id: uuidv4(), title: 'SubscriptionSuccessModal Activités', showOnlyInSearch: true },
    { id: uuidv4(), title: 'UnsubscribingConfirmationModal', showOnlyInSearch: true },
    { id: uuidv4(), title: 'OnboardingSubscriptionModal', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationSubscriptionButtons: CheatcodeCategory[] = [
  subscriptionCheatcodeCategory,
]

export function CheatcodesNavigationSubscription(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const [visibleModal, setVisibleModal] = useState<VisibleModal>(null)

  const visibleSubscreens = subscriptionCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={subscriptionCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        button={{
          id: 'cinema-modal',
          title: 'SubscriptionSuccessModal Cinéma',
          onPress: () => setVisibleModal(SubscriptionTheme.CINEMA),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'lecture-modal',
          title: 'SubscriptionSuccessModal Lecture',
          onPress: () => setVisibleModal(SubscriptionTheme.LECTURE),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'musique-modal',
          title: 'SubscriptionSuccessModal Musique',
          onPress: () => setVisibleModal(SubscriptionTheme.MUSIQUE),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'spectacles-modal',
          title: 'SubscriptionSuccessModal Spectacles',
          onPress: () => setVisibleModal(SubscriptionTheme.SPECTACLES),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'visites-modal',
          title: 'SubscriptionSuccessModal Visites',
          onPress: () => setVisibleModal(SubscriptionTheme.VISITES),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'activites-modal',
          title: 'SubscriptionSuccessModal Activités',
          onPress: () => setVisibleModal(SubscriptionTheme.ACTIVITES),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'unsubscribing-modal',
          title: 'UnsubscribingConfirmationModal',
          onPress: () => setVisibleModal('unsubscribing'),
        }}
        variant="secondary"
      />
      <LinkToCheatcodesScreen
        button={{
          id: 'onboarding-modal',
          title: 'OnboardingSubscriptionModal',
          onPress: () => setVisibleModal('onboarding'),
        }}
        variant="secondary"
      />

      <SubscriptionSuccessModal
        theme={SubscriptionTheme.CINEMA}
        visible={visibleModal === SubscriptionTheme.CINEMA}
        dismissModal={() => setVisibleModal(null)}
      />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.LECTURE}
        visible={visibleModal === SubscriptionTheme.LECTURE}
        dismissModal={() => setVisibleModal(null)}
      />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.MUSIQUE}
        visible={visibleModal === SubscriptionTheme.MUSIQUE}
        dismissModal={() => setVisibleModal(null)}
      />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.SPECTACLES}
        visible={visibleModal === SubscriptionTheme.SPECTACLES}
        dismissModal={() => setVisibleModal(null)}
      />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.VISITES}
        visible={visibleModal === SubscriptionTheme.VISITES}
        dismissModal={() => setVisibleModal(null)}
      />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.ACTIVITES}
        visible={visibleModal === SubscriptionTheme.ACTIVITES}
        dismissModal={() => setVisibleModal(null)}
      />

      <UnsubscribingConfirmationModal
        theme={SubscriptionTheme.VISITES}
        visible={visibleModal === 'unsubscribing'}
        dismissModal={() => setVisibleModal(null)}
        onUnsubscribePress={() => setVisibleModal(null)}
      />
      <OnboardingSubscriptionModal
        visible={visibleModal === 'onboarding'}
        dismissModal={() => setVisibleModal(null)}
      />
    </CheatcodesTemplateScreen>
  )
}
