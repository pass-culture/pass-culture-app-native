import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { domains_credit_v1, domains_credit_v2 } from 'features/profile/fixtures/domainsCredit'
import { parseCurrency } from 'libs/parsers/getDisplayPrice'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationProfile(): React.JSX.Element {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()
  const eighteenYearsOldDepositDeprecated = parseCurrency(500)

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
          <ButtonPrimary
            wording={`Modal Limite ${eighteenYearsOldDepositDeprecated}`}
            onPress={showPhysicalCeilingModal}
          />
          <CreditCeilingsModal
            domainsCredit={domains_credit_v1}
            visible={physicalCeilingModalVisible}
            hideModal={hidePhysicalCeilingModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Modal Limite ${eighteenYearsOldDeposit}`}
            onPress={showCeilingModal}
          />
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
