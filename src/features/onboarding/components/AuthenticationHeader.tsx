import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { styledButton } from 'ui/components/buttons/styledButton'
import { BackButton } from 'ui/components/headers/BackButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

export const AuthenticationHeader: React.FC = () => {
  const { top } = useSafeAreaInsets()

  return (
    <Container top={top}>
      <ButtonContainer>
        <BackButton onGoBack={navigateToHome} />
      </ButtonContainer>
      <ButtonContainer>
        <StyledTouchable accessibilityLabel="Fermer la page" onPress={navigateToHome}>
          <CloseIcon />
        </StyledTouchable>
      </ButtonContainer>
    </Container>
  )
}

const CONTAINER_SIZE = getSpacing(10)

const Container = styled.View<{ top: number }>(({ theme, top }) => ({
  top,
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingHorizontal: getSpacing(4),
  zIndex: theme.zIndex.header,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  width: CONTAINER_SIZE,
  height: CONTAINER_SIZE,
  borderRadius: getSpacing(8),
  backgroundColor: theme.colors.white,
}))

const StyledTouchable = styledButton(Touchable)({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
})

const CloseIcon = styled(Close).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
