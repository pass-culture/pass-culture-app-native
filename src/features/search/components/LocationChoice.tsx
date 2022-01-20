import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { ArrowNext as ArrowNextDefault } from 'ui/svg/icons/ArrowNext'
import { Validate as ValidateDefault } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  section: LocationType.PLACE | LocationType.EVERYWHERE | LocationType.AROUND_ME
  testID: string
  onPress?: () => void
  arrowNext?: boolean
}

export const LocationChoice: React.FC<Props> = (props) => {
  const { colors } = useTheme()
  const { section, onPress, arrowNext = false, testID } = props
  const { Icon, label, isSelected } = useLocationChoice(section)

  return (
    <Container onPress={onPress} testID={`locationChoice-${testID}`}>
      <FirstPart>
        <Spacer.Row numberOfSpaces={3} />
        <Icon color2={isSelected ? colors.primary : colors.secondary} />
        <Spacer.Row numberOfSpaces={3} />
        <TextContainer>
          <ButtonText numberOfLines={3} isSelected={isSelected}>
            {label}
          </ButtonText>
        </TextContainer>
      </FirstPart>
      <SecondPart>
        {!!isSelected && <Validate testID="validateIcon" />}
        {!!arrowNext && <ArrowNext />}
        {!isSelected && !arrowNext ? <Spacer.Row numberOfSpaces={8} /> : null}
      </SecondPart>
    </Container>
  )
}

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const ArrowNext = styled(ArrowNextDefault).attrs(({ theme }) => ({
  size: theme.icon.smSize,
}))``

const Validate = styled(ValidateDefault).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icon.smSize,
}))``

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
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
