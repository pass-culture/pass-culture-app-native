import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { Gradient } from 'features/search/enums'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export type CategoryButtonProps = {
  label: string
  Illustration?: FunctionComponent<AccessibleIcon>
  baseColor?: string
  gradients: Gradient
  onPress: () => void
  children?: never
}

export const CategoryButton: FunctionComponent<CategoryButtonProps> = ({
  label,
  Illustration,
  baseColor,
  gradients,
  onPress,
}) => {
  const focusProps = useHandleFocus()

  const theme = useTheme()

  return (
    <TouchableContainer
      {...focusProps}
      onPress={onPress}
      accessibilityLabel={`Catégorie ${label}`}
      hoverUnderlineColor={theme.colors.white}>
      <IllustrationContainer>
        <StyledLinearGradient colors={[gradients[0], gradients[1]]}>
          {!!Illustration && (
            <IllustrationWrapper>
              <Illustration />
            </IllustrationWrapper>
          )}
        </StyledLinearGradient>
      </IllustrationContainer>
      <LabelContainer baseColor={baseColor}>
        <Label>{label}</Label>
      </LabelContainer>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  height: getSpacing(39),
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const IllustrationContainer = styled.View({
  flex: 1,
  overflow: 'hidden',
  width: '100%',
})

const IllustrationWrapper = styled.View({
  position: 'absolute',
})

const StyledLinearGradient = styled(LinearGradient)({
  flex: 1,
})

const LabelContainer = styled.View<{ baseColor?: string }>(({ baseColor, theme }) => ({
  padding: theme.isMobileViewport ? getSpacing(2) : getSpacing(3),
  width: '100%',
  backgroundColor: baseColor,
}))

const Label = styled(Typo.ButtonText)(({ theme }) => ({
  textAlign: 'left',
  color: theme.colors.white,
}))
