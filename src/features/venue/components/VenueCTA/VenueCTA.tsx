import React from 'react'
import styled from 'styled-components/native'

import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Button } from 'ui/designSystem/Button/Button'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

export const VenueCTA = ({ showSearchInVenueModal }: { showSearchInVenueModal: () => void }) => (
  <StickyBottomWrapper>
    <CallToActionContainer>
      <Button
        wording="Rechercher une offre"
        onPress={showSearchInVenueModal}
        icon={MagnifyingGlassFilled}
        fullWidth
      />
    </CallToActionContainer>
    <Spacer.BottomScreen />
  </StickyBottomWrapper>
)

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  maxWidth: theme.isMobileViewport ? undefined : theme.contentPage.maxWidth,
  paddingVertical: theme.contentPage.marginVertical,
}))
