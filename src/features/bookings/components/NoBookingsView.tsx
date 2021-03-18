import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT, Typo } from 'ui/theme'

export function NoBookingsView() {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <NoBookings size={197} color={ColorsEnum.GREY_MEDIUM} />
      <Explanation color={ColorsEnum.GREY_DARK}>
        {_(t`Tu n’as pas de réservations en cours.
      Découvre les offres disponibles 
      sans attendre !`)}
      </Explanation>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <ButtonPrimary title={_(t`Explorer les offres`)} onPress={() => navigate('Search')} />
      </ButtonContainer>
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
  maxWidth: 200,
  width: '100%',
})

const Explanation = styled(Typo.Body)({
  textAlign: 'center',
})
