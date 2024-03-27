import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Row } from 'features/internal/cheatcodes/components/Row'
import { SubscriptionSuccessModal } from 'features/subscription/components/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/UnsubscribingConfirmationModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationSubscription(): React.JSX.Element {
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

  return (
    <ScrollView>
      <PageHeaderSecondary title="Subscription 🔔" />
      <StyledContainer>
        <Row half>
          <ButtonPrimary wording="Modale Cinéma" onPress={showCinemaModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.CINEMA}
            visible={cinemaModalVisible}
            dismissModal={hideCinemaModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Lecture" onPress={showLectureModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.LECTURE}
            visible={lectureModalVisible}
            dismissModal={hideLectureModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Musique" onPress={showMusiqueModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.MUSIQUE}
            visible={musiqueModalVisible}
            dismissModal={hideMusiqueModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Spectacles" onPress={showSpectaclesModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.SPECTACLES}
            visible={spectaclesModalVisible}
            dismissModal={hideSpectaclesModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Visites et sorties" onPress={showVisitesModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.VISITES}
            visible={visitesModalVisible}
            dismissModal={hideVisitesModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Activités créatives" onPress={showActivitesModal} />
          <SubscriptionSuccessModal
            theme={SubscriptionTheme.ACTIVITES}
            visible={activitesModalVisible}
            dismissModal={hideActivitesModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modale Désincription" onPress={showUnsubscribingModal} />
          <UnsubscribingConfirmationModal
            theme={SubscriptionTheme.VISITES}
            visible={unsubscribingModalVisible}
            dismissModal={hideUnsubscribingModal}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
