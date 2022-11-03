import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Row } from 'features/cheatcodes/components/Row'
import { useShareAppContext } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'

export function NavigationShareApp(): JSX.Element {
  const { showShareAppModal } = useShareAppContext()

  return (
    <ScrollView>
      <PageHeader title="Share app 🔗" position="absolute" withGoBackButton />
      <StyledContainer>
        <Row half>
          <ButtonPrimary
            wording="Not Eligible modal"
            onPress={() => showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Beneficiary modal"
            onPress={() => showShareAppModal(ShareAppModalType.BENEFICIARY)}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Booking modal"
            onPress={() => showShareAppModal(ShareAppModalType.ON_BOOKING_SUCCESS)}
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
