import React from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { useLogBeforeNavToSearchResults } from 'features/search/utils/useLogBeforeNavToSearchResults'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function NoBookingsView() {
  const netInfo = useNetInfoContext()
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: 'bookings' })
  const searchNavConfig = getTabNavConfig('Search', { view: SearchView.Landing })

  return (
    <Container>
      <Spacer.Flex />
      {!netInfo.isConnected ? (
        <React.Fragment>
          <StyledNoBookings />
          <StyledBody offline>Aucune réservations en cours.</StyledBody>
          <StyledBody offline>
            Il est possible que certaines réservations ne s’affichent pas hors connexion.
            Connecte-toi à internet pour vérifier.
          </StyledBody>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledNoBookings />
          <StyledBody>
            Tu n’as pas de réservations en cours. Découvre les offres disponibles sans
            attendre&nbsp;!
          </StyledBody>
          <ButtonContainer>
            <TouchableLink
              as={ButtonPrimary}
              navigateTo={{ screen: searchNavConfig[0], params: searchNavConfig[1] }}
              wording="Explorer les offres"
              onPress={onPressExploreOffers}
              buttonHeight="tall"
            />
          </ButtonContainer>
        </React.Fragment>
      )}
      <Spacer.Flex />
    </Container>
  )
}

const StyledNoBookings = styled(NoBookings).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.greyMedium,
}))``

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: getSpacing(10),
})

const ButtonContainer = styled.View``

const StyledBody = styled(Typo.Body)<{ offline?: boolean }>(({ theme, offline }) => ({
  paddingHorizontal: getSpacing(offline ? 8 : 4),
  paddingVertical: getSpacing(4),
  maxWidth: theme.contentPage.maxWidth,
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
