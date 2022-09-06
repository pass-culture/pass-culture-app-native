import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

type HeroButtonListProps = {
  title?: string
  icon: FunctionComponent<IconInterface>
  onPress: () => void
  selected: boolean
}
export const HeroButtonList: FunctionComponent<HeroButtonListProps> = (props) => {
  const Icon = styled(props.icon).attrs(({ theme }) => ({
    color: theme.colors.secondary,
    color2: theme.colors.primary,
    size: theme.icons.sizes.standard,
  }))``

  return (
    <ChoiceContainer onPress={props.onPress} testID={`${props?.title}-HeroButtonList`}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <DescriptionContainer>
        <Text>
          <Typo.Body>J’ai une carte d’identité, un passeport </Typo.Body>
          <Typo.ButtonText>étranger</Typo.ButtonText>
          <Typo.Body> ou un titre séjour français</Typo.Body>
        </Text>
      </DescriptionContainer>
      <View>
        <StyledArrowNextIcon />
      </View>
    </ChoiceContainer>
  )
}

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const ChoiceContainer = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  border: getSpacing(0.25),
  borderRadius: getSpacing(1.8),
  borderColor: theme.colors.greySemiDark,
  minHeight: getSpacing(18),
  paddingHorizontal: getSpacing(4),
}))

const DescriptionContainer = styled.View({
  flex: 1,
  marginHorizontal: getSpacing(4),
})

const IconContainer = styled.View({
  alignContent: 'center',
  marginVertical: getSpacing(7.5),
})
