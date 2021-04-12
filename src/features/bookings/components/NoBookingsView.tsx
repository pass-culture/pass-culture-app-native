import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT, Typo } from 'ui/theme'

export function NoBookingsView() {
  const onPressExploreOffers = useNavigateToSearchResults({ from: 'bookings' })

  return (
    <Container>
      <Spacer.Flex />
      <NoBookings size={197} color={ColorsEnum.GREY_MEDIUM} />
      <Explanation color={ColorsEnum.GREY_DARK}>
        {t`Tu n’as pas de réservations en cours.
      Découvre les offres disponibles 
      sans attendre !`}
      </Explanation>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary
          title={t`Explorer les offres`}
          onPress={onPressExploreOffers}
          buttonHeight="tall"
        />
      </ButtonContainer>
      <Spacer.Flex flex={2} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: TAB_BAR_COMP_HEIGHT,
  padding: getSpacing(4),
})

const ButtonContainer = styled.View({
  maxWidth: getSpacing(44),
  width: '100%',
})

const Explanation = styled(Typo.Body)({
  flex: 1,
  textAlign: 'center',
})
