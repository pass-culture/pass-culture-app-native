import React, { useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { Typo } from 'ui/theme'

type Props = {
  onPress?: () => void
  arrowNext?: boolean
  accessibilityDescribedBy?: string
  // used by DeeplinksGeneratorForm
  isSelected: boolean
  disabled?: boolean
  label: string
  Icon: React.FC<AccessibleIcon>
}

export const LocationChoice: React.FC<Props> = ({
  onPress,
  arrowNext = false,
  accessibilityDescribedBy,
  isSelected = false,
  disabled = false,
  label,
  Icon,
}) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: isSelected
      ? theme.designSystem.color.icon.brandPrimary
      : theme.designSystem.color.icon.brandSecondary,
    size: theme.icons.sizes.small,
  }))``

  const containerRef = useRef(null)
  useArrowNavigationForRadioButton(containerRef)

  const { onFocus, onBlur, isFocus } = useHandleFocus()
  useSpaceBarAction(isFocus ? onPress : undefined)

  return (
    <Container
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      {...accessibleRadioProps({ checked: isSelected, label })}>
      <FirstPart ref={containerRef}>
        <WrapperStyledIcon />
        <StyledIcon />
        <WrapperStyledIcon />
        <TextContainer>
          <ButtonText
            numberOfLines={3}
            isSelected={isSelected}
            accessibilityDescribedBy={accessibilityDescribedBy}>
            {label}
          </ButtonText>
        </TextContainer>
        {isSelected ? <Validate testID="validateIcon" /> : null}
      </FirstPart>
      <SecondPart isSelected={isSelected} arrowNext={arrowNext}>
        {arrowNext ? <ArrowNext /> : null}
      </SecondPart>
    </Container>
  )
}

const WrapperStyledIcon = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xs,
}))
const Container = styled(TouchableOpacity)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: theme.designSystem.size.spacing.l,
}))

const FirstPart = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
})

const TextContainer = styled.View(({ theme }) => ({
  flex: theme.isMobileViewport ? 1 : undefined,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  marginRight: theme.isMobileViewport ? 0 : theme.designSystem.size.spacing.l,
}))

const SecondPart = styled.View<{ isSelected: boolean; arrowNext: boolean }>(
  ({ isSelected, arrowNext, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    marginLeft: !arrowNext && !isSelected ? theme.designSystem.size.spacing.xl : 0,
  })
)

const ButtonText = styled(Typo.BodyAccent)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected
    ? theme.designSystem.color.text.brandPrimary
    : theme.designSystem.color.text.default,
}))

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.small,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
