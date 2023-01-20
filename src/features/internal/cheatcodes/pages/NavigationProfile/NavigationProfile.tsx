import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { domains_credit_v1, domains_credit_v2 } from 'features/profile/fixtures/domainsCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationProfile(): JSX.Element {
  const {
    visible: ceilingModalVisible,
    showModal: showCeilingModal,
    hideModal: hideCeilingModal,
  } = useModal(false)

  const {
    visible: physicalCeilingModalVisible,
    showModal: showPhysicalCeilingModal,
    hideModal: hidePhysicalCeilingModal,
  } = useModal(false)

  const {
    visible: expiredCreditModalVisible,
    showModal: showExpiredCreditModal,
    hideModal: hideExpiredCreditModal,
  } = useModal(false)

  const {
    visible: exhaustedCreditModalVisible,
    showModal: showExhaustedCreditModal,
    hideModal: hideExhaustedCreditModal,
  } = useModal(false)

  return (
    <ScrollView>
      <PageHeaderSecondary title="Profile 🎨" />
      <StyledContainer>
        <LinkToComponent name="Login" />
        <LinkToComponent name="ChangeEmail" />
        <LinkToComponent name="ConsentSettings" />
        <LinkToComponent name="NotificationSettings" />
        <Row half>
          <ButtonPrimary wording="Modal Limite 500&nbsp;€" onPress={showPhysicalCeilingModal} />
          <CreditCeilingsModal
            domainsCredit={domains_credit_v1}
            visible={physicalCeilingModalVisible}
            hideModal={hidePhysicalCeilingModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modal Limite 300&nbsp;€" onPress={showCeilingModal} />
          <CreditCeilingsModal
            domainsCredit={domains_credit_v2}
            visible={ceilingModalVisible}
            hideModal={hideCeilingModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
          <ExpiredCreditModal
            visible={expiredCreditModalVisible}
            hideModal={hideExpiredCreditModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Modal Crédit Dépensé" onPress={showExhaustedCreditModal} />
          <ExhaustedCreditModal
            visible={exhaustedCreditModalVisible}
            hideModal={hideExhaustedCreditModal}
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
