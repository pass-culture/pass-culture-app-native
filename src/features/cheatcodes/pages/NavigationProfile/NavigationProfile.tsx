import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import {
  domains_credit_v1,
  domains_credit_v2,
} from 'features/cheatcodes/pages/AppComponents/AppComponents'
import { useGoBack } from 'features/navigation/useGoBack'
import { CreditCeilingsModal } from 'features/profile/components/CreditCeilingsModal'
import { ExpiredCreditModal } from 'features/profile/components/ExpiredCreditModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationProfile(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)

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
      <Spacer.TopScreen />
      <ModalHeader
        title="Profile 🎨"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <LinkToComponent name="Login" />
        <LinkToComponent name="ChangeEmail" />
        <LinkToComponent name="ConsentSettings" />
        <LinkToComponent name="NotificationSettings" />
        <Row half>
          <ButtonPrimary wording={'Modal Limite 500 €'} onPress={showPhysicalCeilingModal} />
          <CreditCeilingsModal
            domainsCredit={domains_credit_v1}
            visible={physicalCeilingModalVisible}
            hideModal={hidePhysicalCeilingModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={'Modal Limite 300 €'} onPress={showCeilingModal} />
          <CreditCeilingsModal
            domainsCredit={domains_credit_v2}
            visible={ceilingModalVisible}
            hideModal={hideCeilingModal}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={'Modal Crédit Expiré'} onPress={showExpiredCreditModal} />
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

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
