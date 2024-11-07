import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationProfile(): React.JSX.Element {
  const {
    visible: expiredCreditModalVisible,
    showModal: showExpiredCreditModal,
    hideModal: hideExpiredCreditModal,
  } = useModal(false)

  return (
    <ScrollView>
      <CheatcodesHeader title="Profile 🎨" />
      <StyledContainer>
        <LinkToComponent name="Login" />
        <LinkToComponent name="FeedbackInApp" />
        <LinkToComponent name="ChangeCity" />
        <LinkToComponent name="ChangeEmail" />
        <LinkToComponent name="ChangeStatus" />
        <LinkToComponent name="ChangeEmailSetPassword" navigationParams={{ token: 'token' }} />
        <LinkToComponent name="ConsentSettings" />
        <LinkToComponent name="NotificationsSettings" />
        <Row half>
          <ButtonPrimary wording="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
          <ExpiredCreditModal
            visible={expiredCreditModalVisible}
            hideModal={hideExpiredCreditModal}
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
