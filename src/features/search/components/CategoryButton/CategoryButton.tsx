import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Gradient } from 'features/search/enums'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export type CategoryButtonProps = {
  label: string
  Illustration?: FunctionComponent<AccessibleIcon>
  baseColor?: string
  gradients: Gradient[]
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
  return (
    <TouchableContainer onPress={onPress} accessibilityLabel={`Catégorie ${label}`}>
      <IllustrationContainer>
        <StyledLinearGradient
          start={gradients[1].position}
          end={gradients[0].position}
          colors={[gradients[1].color, gradients[0].color]}>
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

const TouchableContainer = styledButton(Touchable)({
  height: getSpacing(39),
  overflow: 'hidden',
})

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

const LabelContainer = styled.View<{ baseColor?: string }>(({ baseColor }) => ({
  paddingLeft: getSpacing(3),
  paddingTop: getSpacing(3),
  paddingRight: getSpacing(4),
  paddingBottom: getSpacing(4),
  width: '100%',
  backgroundColor: baseColor,
}))

const Label = styled(Typo.ButtonText)(({ theme }) => ({
  textAlign: 'left',
  color: theme.colors.white,
}))
