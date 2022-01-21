import React from 'react'
import styled from 'styled-components/native'

import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo, ColorsEnum } from 'ui/theme'

type Props = {
  section: LocationType.PLACE | LocationType.EVERYWHERE | LocationType.AROUND_ME
  testID: string
  onPress?: () => void
  arrowNext?: boolean
}

export const LocationChoice: React.FC<Props> = (props) => {
  const { section, onPress, arrowNext = false, testID } = props
  const { Icon, label, isSelected } = useLocationChoice(section)
  const iconColor2 = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY

  return (
    <Container onPress={onPress} testID={`locationChoice-${testID}`}>
      <FirstPart>
        <Spacer.Row numberOfSpaces={3} />
        <Icon color2={iconColor2} />
        <Spacer.Row numberOfSpaces={3} />
        <TextContainer>
          <Typo.ButtonText
            numberOfLines={3}
            color={isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
            {label}
          </Typo.ButtonText>
        </TextContainer>
      </FirstPart>
      <SecondPart>
        {!!isSelected && (
          <Validate color={ColorsEnum.PRIMARY} testID="validateIcon" size={getSpacing(6)} />
        )}
        {!!arrowNext && <ArrowNext size={getSpacing(6)} />}
        {!isSelected && !arrowNext ? <Spacer.Row numberOfSpaces={8} /> : null}
      </SecondPart>
    </Container>
  )
}

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
