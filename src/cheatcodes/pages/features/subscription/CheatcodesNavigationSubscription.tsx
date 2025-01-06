import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { ButtonsWithSubscreensProps } from 'cheatcodes/types'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { SubscriptionSuccessModal } from 'features/subscription/components/modals/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { useModal } from 'ui/components/modals/useModal'

export const cheatcodesNavigationSubscriptionButtons: [ButtonsWithSubscreensProps] = [
  {
    title: 'Subscription 🔔',
    screen: 'CheatcodesNavigationSubscription',
    subscreens: [{ screen: 'OnboardingSubscription' }],
  },
]

export function CheatcodesNavigationSubscription(): React.JSX.Element {
  const {
    visible: cinemaModalVisible,
    showModal: showCinemaModal,
    hideModal: hideCinemaModal,
  } = useModal(false)
  const {
    visible: lectureModalVisible,
    showModal: showLectureModal,
    hideModal: hideLectureModal,
  } = useModal(false)
  const {
    visible: musiqueModalVisible,
    showModal: showMusiqueModal,
    hideModal: hideMusiqueModal,
  } = useModal(false)
  const {
    visible: spectaclesModalVisible,
    showModal: showSpectaclesModal,
    hideModal: hideSpectaclesModal,
  } = useModal(false)
  const {
    visible: visitesModalVisible,
    showModal: showVisitesModal,
    hideModal: hideVisitesModal,
  } = useModal(false)
  const {
    visible: activitesModalVisible,
    showModal: showActivitesModal,
    hideModal: hideActivitesModal,
  } = useModal(false)
  const {
    visible: unsubscribingModalVisible,
    showModal: showUnsubscribingModal,
    hideModal: hideUnsubscribingModal,
  } = useModal(false)
  const {
    visible: onboardingSubModalVisible,
    showModal: showOnboardingSubModal,
    hideModal: hideOnboardingSubModal,
  } = useModal(false)

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationSubscriptionButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationSubscriptionButtons} />

      <LinkToScreen title="Modale Cinéma" onPress={showCinemaModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.CINEMA}
        visible={cinemaModalVisible}
        dismissModal={hideCinemaModal}
      />

      <LinkToScreen title="Modale Lecture" onPress={showLectureModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.LECTURE}
        visible={lectureModalVisible}
        dismissModal={hideLectureModal}
      />

      <LinkToScreen title="Modale Musique" onPress={showMusiqueModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.MUSIQUE}
        visible={musiqueModalVisible}
        dismissModal={hideMusiqueModal}
      />

      <LinkToScreen title="Modale Spectacles" onPress={showSpectaclesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.SPECTACLES}
        visible={spectaclesModalVisible}
        dismissModal={hideSpectaclesModal}
      />

      <LinkToScreen title="Modale Visites et sorties" onPress={showVisitesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.VISITES}
        visible={visitesModalVisible}
        dismissModal={hideVisitesModal}
      />

      <LinkToScreen title="Modale Activités créatives" onPress={showActivitesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.ACTIVITES}
        visible={activitesModalVisible}
        dismissModal={hideActivitesModal}
      />

      <LinkToScreen title="Modale Désinscription" onPress={showUnsubscribingModal} />
      <UnsubscribingConfirmationModal
        theme={SubscriptionTheme.VISITES}
        visible={unsubscribingModalVisible}
        dismissModal={hideUnsubscribingModal}
        onUnsubscribePress={hideUnsubscribingModal}
      />

      <LinkToScreen title="Modale Onboarding" onPress={showOnboardingSubModal} />
      <OnboardingSubscriptionModal
        visible={onboardingSubModalVisible}
        dismissModal={hideOnboardingSubModal}
      />
    </CheatcodesTemplateScreen>
  )
}
