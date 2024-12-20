import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { SubscriptionSuccessModal } from 'features/subscription/components/modals/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { useModal } from 'ui/components/modals/useModal'

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
    <CheatcodesTemplateScreen title="Subscription 🔔">
      <LinkToComponent name="OnboardingSubscription" />
      <LinkToComponent title="Modale Cinéma" onPress={showCinemaModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.CINEMA}
        visible={cinemaModalVisible}
        dismissModal={hideCinemaModal}
      />
      <LinkToComponent title="Modale Lecture" onPress={showLectureModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.LECTURE}
        visible={lectureModalVisible}
        dismissModal={hideLectureModal}
      />
      <LinkToComponent title="Modale Musique" onPress={showMusiqueModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.MUSIQUE}
        visible={musiqueModalVisible}
        dismissModal={hideMusiqueModal}
      />
      <LinkToComponent title="Modale Spectacles" onPress={showSpectaclesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.SPECTACLES}
        visible={spectaclesModalVisible}
        dismissModal={hideSpectaclesModal}
      />
      <LinkToComponent title="Modale Visites et sorties" onPress={showVisitesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.VISITES}
        visible={visitesModalVisible}
        dismissModal={hideVisitesModal}
      />
      <LinkToComponent title="Modale Activités créatives" onPress={showActivitesModal} />
      <SubscriptionSuccessModal
        theme={SubscriptionTheme.ACTIVITES}
        visible={activitesModalVisible}
        dismissModal={hideActivitesModal}
      />
      <LinkToComponent title="Modale Désinscription" onPress={showUnsubscribingModal} />
      <UnsubscribingConfirmationModal
        theme={SubscriptionTheme.VISITES}
        visible={unsubscribingModalVisible}
        dismissModal={hideUnsubscribingModal}
        onUnsubscribePress={hideUnsubscribingModal}
      />
      <LinkToComponent title="Modale Onboarding" onPress={showOnboardingSubModal} />
      <OnboardingSubscriptionModal
        visible={onboardingSubModalVisible}
        dismissModal={hideOnboardingSubModal}
      />
    </CheatcodesTemplateScreen>
  )
}
