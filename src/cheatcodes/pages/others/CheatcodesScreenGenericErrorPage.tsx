import React from 'react'
import styled from 'styled-components/native'

import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { Typo, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CheatcodesScreenGenericErrorPage = () => {
  const { goBack } = useGoBack(...homeNavigationConfig)
  const { top } = useCustomSafeInsets()

  return (
    <GenericErrorPage
      helmetTitle="HelmetTitle"
      header={
        <HeaderContainer
          onPress={goBack}
          top={top + getSpacing(3.5)}
          accessibilityLabel="Revenir en arrière">
          <StyledArrowPrevious />
        </HeaderContainer>
      }
      illustration={MaintenanceCone}
      title="Title"
      subtitle="Subtitle"
      buttonPrimary={{ wording: 'Primary button', onPress: () => 'doNothing' }}
      buttonTertiary={{ wording: 'Tertiary button', onPress: () => 'doNothing' }}>
      <Typo.Body>Children...</Typo.Body>
    </GenericErrorPage>
  )
}

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.designSystem.color.icon.default,
}))``
