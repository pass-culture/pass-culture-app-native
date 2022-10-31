import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Row } from 'features/cheatcodes/components/Row'
import { ShareAppModalNew } from 'features/shareApp/components/ShareAppModalNew'
import { ShareAppModal } from 'features/shareApp/helpers/shareAppModalInformations'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'

export function NavigationShareApp(): JSX.Element {
  const {
    visible: shareAppUnderageModalVisible,
    showModal: showShareAppUnderageModal,
    hideModal: hideShareAppUnderageModal,
  } = useModal(false)
  const {
    visible: shareAppBeneficiaryModalVisible,
    showModal: showShareAppBeneficiaryModal,
    hideModal: hideShareAppBeneficiaryModal,
  } = useModal(false)
  const {
    visible: shareAppBookingModalVisible,
    showModal: showShareAppBookingModal,
    hideModal: hideShareAppBookingModal,
  } = useModal(false)

  return (
    <ScrollView>
      <PageHeader title="Share app 🔗" position="absolute" withGoBackButton />
      <StyledContainer>
        <Row half>
          <ButtonPrimary wording="Underage modal" onPress={showShareAppUnderageModal} />
          <ShareAppModalNew
            visible={shareAppUnderageModalVisible}
            hideModal={hideShareAppUnderageModal}
            modalType={ShareAppModal.NOT_ELIGIBLE}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Beneficiary modal" onPress={showShareAppBeneficiaryModal} />
          <ShareAppModalNew
            visible={shareAppBeneficiaryModalVisible}
            hideModal={hideShareAppBeneficiaryModal}
            modalType={ShareAppModal.BENEFICIARY}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Booking modal" onPress={showShareAppBookingModal} />
          <ShareAppModalNew
            visible={shareAppBookingModalVisible}
            hideModal={hideShareAppBookingModal}
            modalType={ShareAppModal.ON_BOOKING_SUCCESS}
          />
        </Row>
      </StyledContainer>
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
