import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SearchNavigationConfig } from 'features/venue/types'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

interface Props {
  searchNavigationConfig: SearchNavigationConfig
  onBeforeNavigate: () => void
}

export const OldVenueCTA: FunctionComponent<Props> = ({
  searchNavigationConfig,
  onBeforeNavigate,
}) => {
  return (
    <StickyBottomWrapper>
      <CallToActionContainer>
        <InternalTouchableLink
          navigateTo={searchNavigationConfig}
          onBeforeNavigate={onBeforeNavigate}
          as={Button}
          wording="Rechercher une offre"
          icon={MagnifyingGlassFilled}
          fullWidth
        />
      </CallToActionContainer>
      <Spacer.BottomScreen />
    </StickyBottomWrapper>
  )
}

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  maxWidth: theme.isMobileViewport ? undefined : theme.contentPage.maxWidth,
  paddingVertical: theme.contentPage.marginVertical,
}))
