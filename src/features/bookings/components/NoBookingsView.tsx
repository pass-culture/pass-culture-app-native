import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { EndedBookingsSection } from 'features/bookings/pages/EndedBookingsSection'
import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoBookingsDeprecated as NoBookings } from 'ui/svg/icons/NoBookings_deprecated'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function NoBookingsView() {
  const onPressExploreOffers = useNavigateToSearchResults({ from: 'bookings' })

  return (
    <Container>
      <Spacer.Flex />
      <NoBookings size={197} color={ColorsEnum.GREY_MEDIUM} />
      <Explanation color={ColorsEnum.GREY_DARK}>
        {t`Tu n’as pas de réservations en cours.
      Découvre les offres disponibles 
      sans attendre\u00a0!`}
      </Explanation>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary
          title={t`Explorer les offres`}
          onPress={onPressExploreOffers}
          buttonHeight="tall"
        />
      </ButtonContainer>
      <Spacer.Flex />
      <Spacer.Column numberOfSpaces={8} />
      <EndedBookingsSection />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: getSpacing(10),
})

const ButtonContainer = styled.View({
  maxWidth: getSpacing(44),
  width: '100%',
})

const Explanation = styled(Typo.Body)({
  flex: 1,
  textAlign: 'center',
})
