import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SearchNavConfig } from 'features/venue/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

export const VENUE_CTA_HEIGHT_IN_SPACES = 6 + 10 + 6

interface Props {
  searchNavConfig: SearchNavConfig
  onBeforeNavigate: () => void
}

export const VenueCTA: FunctionComponent<Props> = ({ searchNavConfig, onBeforeNavigate }) => {
  return (
    <StickyBottomWrapper>
      <CallToActionContainer>
        <Spacer.Column numberOfSpaces={6} />
        <InternalTouchableLink
          navigateTo={searchNavConfig}
          onBeforeNavigate={onBeforeNavigate}
          as={ButtonPrimary}
          wording="Rechercher une offre"
          icon={SmallMagnifyingGlass}
          fullWidth
        />
        <Spacer.Column numberOfSpaces={6} />
      </CallToActionContainer>
      <Spacer.BottomScreen />
    </StickyBottomWrapper>
  )
}

const SmallMagnifyingGlass = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  ...(!theme.isMobileViewport && {
    maxWidth: theme.contentPage.maxWidth,
  }),
}))
