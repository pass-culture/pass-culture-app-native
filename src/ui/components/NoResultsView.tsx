import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { useLogBeforeNavToSearchResults } from 'features/search/utils/useLogBeforeNavToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  explanations: string
  icon: FunctionComponent<IconInterface>
  offline?: boolean
  trackingExplorerOffersFrom: 'bookings' | 'favorites'
}

export const NoResultsView = ({
  title,
  explanations,
  icon,
  offline = false,
  trackingExplorerOffersFrom,
}: Props) => {
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: trackingExplorerOffersFrom })
  const searchNavConfig = getTabNavConfig('Search', { view: SearchView.Landing })

  const Icon =
    !!icon &&
    styled(icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.colors.greyMedium,
    }))``

  return (
    <Container>
      <Typo.Body>{title}</Typo.Body>
      <CenteredContainer>
        <Spacer.Flex />
        {!!Icon && <Icon />}
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>{explanations}</StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        {!offline && (
          <ButtonContainer>
            <TouchableLink
              as={ButtonPrimary}
              navigateTo={{ screen: searchNavConfig[0], params: searchNavConfig[1] }}
              wording="Découvrir le catalogue"
              onBeforeNavigate={onPressExploreOffers}
              buttonHeight="tall"
              icon={MagnifyingGlass}
            />
          </ButtonContainer>
        )}
        <Spacer.Flex />
      </CenteredContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  marginBottom: theme.tabBar.height,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CenteredContainer = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  textAlign: 'center',
}))

const ButtonContainer = styled.View({
  marginTop: getSpacing(2),
})
