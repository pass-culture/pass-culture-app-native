import React, { useRef } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  testID: string
  onPress?: () => void
  arrowNext?: boolean
  accessibilityDescribedBy?: string
  // used by DeeplinksGeneratorForm
  isSelected: boolean
  disabled?: boolean
  label: string
  Icon: React.FC<BicolorIconInterface>
}

export const LocationChoice: React.FC<Props> = ({
  onPress,
  arrowNext = false,
  testID,
  accessibilityDescribedBy,
  isSelected,
  disabled = false,
  label,
  Icon,
}) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color2: isSelected ? theme.colors.primary : theme.colors.secondary,
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
      accessibilityRole={AccessibilityRole.RADIO}
      accessibilityState={{ checked: isSelected }}
      testID={`locationChoice-${testID}`}>
      <FirstPart ref={containerRef}>
        <Spacer.Row numberOfSpaces={3} />
        <StyledIcon />
        <Spacer.Row numberOfSpaces={3} />
        <TextContainer>
          <ButtonText
            numberOfLines={3}
            isSelected={isSelected}
            aria-describedby={accessibilityDescribedBy}>
            {label}
          </ButtonText>
        </TextContainer>
        {isSelected ? <Validate testID="validateIcon" /> : null}
      </FirstPart>
      <SecondPart>
        {arrowNext ? <ArrowNext /> : null}
        {!isSelected && !arrowNext ? <Spacer.Row numberOfSpaces={8} /> : null}
      </SecondPart>
    </Container>
  )
}

const Container = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(4),
})

const FirstPart = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
})

const TextContainer = styled.View(({ theme }) => ({
  flex: theme.isMobileViewport ? 1 : undefined,
  paddingHorizontal: getSpacing(2),
  marginRight: theme.isMobileViewport ? 0 : getSpacing(4),
}))

const SecondPart = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
})

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
