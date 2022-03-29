import React from 'react'
import styled from 'styled-components/native'

import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
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
}

export const LocationChoice: React.FC<Props> = (props) => {
  const { section, onPress, arrowNext = false, testID, accessibilityDescribedBy } = props
  const { Icon, label, isSelected } = useLocationChoice(section)
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color2: isSelected ? theme.colors.primary : theme.colors.secondary,
    size: theme.icons.sizes.small,
  }))``

  const selected = props.isSelected ?? isSelected

  return (
    <Container
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      testID={`locationChoice-${testID}`}>
      <FirstPart>
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
      </FirstPart>
      <SecondPart>
        {selected ? <Validate testID="validateIcon" /> : null}
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

const TextContainer = styled.View({
  flex: 1,
  paddingHorizontal: getSpacing(2),
})

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
