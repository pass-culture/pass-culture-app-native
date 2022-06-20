import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { EndedBookingsSection } from 'features/bookings/pages/EndedBookingsSection'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useLogBeforeNavToSearchResults } from 'features/search/utils/useLogBeforeNavToSearchResults'
import { useNetInfo } from 'libs/network/useNetInfo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function NoBookingsView() {
  const netInfo = useNetInfo()
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: 'bookings' })
  const searchNavConfig = getTabNavConfig('Search', { showResults: true })

  return (
    <Container>
      {!netInfo.isConnected ? (
        <React.Fragment>
          <Spacer.Flex />
          <Spacer.Column numberOfSpaces={getSpacing(2.5)} />
          <StyledNoBookings />
          <Explanation>{t`Tu n’as pas de réservations en cours.`}</Explanation>
          <Explanation>
            {t`Il est possible que certaines réservations ne s'affichent pas hors connexion. Connecte toi à internet pour vérifier.`}
          </Explanation>
          <Spacer.Flex />
          <Spacer.Column numberOfSpaces={getSpacing(10)} />
          <Spacer.Flex />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Spacer.Flex />
          <StyledNoBookings />
          <Explanation>
            {t`Tu n’as pas de réservations en cours.
      Découvre les offres disponibles
      sans attendre\u00a0!`}
          </Explanation>
          <Spacer.Column numberOfSpaces={getSpacing(2)} />
          <ButtonContainer>
            <TouchableLink
              as={ButtonPrimary}
              navigateTo={{ screen: searchNavConfig[0], params: searchNavConfig[1] }}
              wording={t`Explorer les offres`}
              onPress={onPressExploreOffers}
              buttonHeight="tall"
            />
          </ButtonContainer>
          <Spacer.Flex />
          <Spacer.Column numberOfSpaces={getSpacing(2)} />
          <EndedBookingsSection />
        </React.Fragment>
      )}
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

const ButtonContainer = styled.View({})

const Explanation = styled(Typo.Body)(({ theme }) => ({
  flex: 1,
  paddingHorizontal: getSpacing(4),
  maxWidth: theme.contentPage.maxWidth,
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
