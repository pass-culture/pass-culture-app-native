import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Sort } from 'ui/svg/icons/Sort'
import { Spacer } from 'ui/theme'

export const SortButton: FunctionComponent = () => {
  return (
    <SortContainer>
      <InternalTouchableLink
        navigateTo={{ screen: 'FavoritesSorts' }}
        accessibilityLabel="Trier"
        as={Button}
        wording="Trier"
        variant="secondary"
        icon={Sort}
      />
      <Spacer.BottomScreen />
    </SortContainer>
  )
}

const SortContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  bottom: theme.tabBar.height + theme.designSystem.size.spacing.xl,
  zIndex: theme.zIndex.floatingButton,
}))
