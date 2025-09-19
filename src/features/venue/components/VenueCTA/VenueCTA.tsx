import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

export const VenueCTA = ({ showSearchInVenueModal }: { showSearchInVenueModal: () => void }) => (
  <StickyBottomWrapper>
    <CallToActionContainer>
      <ButtonPrimary
        wording="Rechercher une offre"
        onPress={showSearchInVenueModal}
        icon={SmallMagnifyingGlass}
      />
    </CallToActionContainer>
    <Spacer.BottomScreen />
  </StickyBottomWrapper>
)

const SmallMagnifyingGlass = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  maxWidth: theme.isMobileViewport ? undefined : theme.contentPage.maxWidth,
  paddingVertical: theme.contentPage.marginVertical,
}))
