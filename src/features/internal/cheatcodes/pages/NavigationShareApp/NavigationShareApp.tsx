import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export function NavigationShareApp(): React.JSX.Element {
  const { showShareAppModal } = useShareAppContext()

  return (
    <ScrollView>
      <CheatcodesHeader title="Share app 🔗" />
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
