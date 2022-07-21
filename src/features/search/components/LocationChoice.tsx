import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  section: LocationType.PLACE | LocationType.EVERYWHERE | LocationType.AROUND_ME
  testID: string
  onPress?: () => void
  arrowNext?: boolean
  accessibilityDescribedBy?: string
  // used by DeeplinksGeneratorForm
  isSelected?: boolean
  disabled?: boolean
}

export const LocationChoice: React.FC<Props> = ({
  section,
  onPress,
  arrowNext = false,
  testID,
  accessibilityDescribedBy,
  isSelected,
  disabled = false,
}) => {
  const { Icon, label, isSelected: defaultIsSelected } = useLocationChoice(section)
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color2: defaultIsSelected ? theme.colors.primary : theme.colors.secondary,
    size: theme.icons.sizes.small,
  }))``

  const containerRef = useRef(null)
  useArrowNavigationForRadioButton(containerRef)

  const [isFocus, setIsFocus] = useState(false)
  useSpaceBarAction(isFocus ? onPress : undefined)

  const selected = isSelected ?? defaultIsSelected

  return (
    <Container
      onPress={onPress}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      disabled={disabled}
      accessibilityRole={AccessibilityRole.RADIO}
      accessibilityState={{ checked: selected }}
      testID={`locationChoice-${testID}`}>
      <FirstPart ref={containerRef}>
        <Spacer.Row numberOfSpaces={3} />
        <StyledIcon />
        <Spacer.Row numberOfSpaces={3} />
        <TextContainer>
          <ButtonText
            numberOfLines={3}
            isSelected={selected}
            aria-describedby={accessibilityDescribedBy}>
            {label}
          </ButtonText>
        </TextContainer>
        {selected ? <Validate testID="validateIcon" /> : null}
      </FirstPart>
      <SecondPart>
        {arrowNext ? <ArrowNext /> : null}
        {!selected && !arrowNext ? <Spacer.Row numberOfSpaces={8} /> : null}
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
