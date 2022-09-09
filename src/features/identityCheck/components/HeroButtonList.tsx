import React, { FunctionComponent, ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HeroButtonListProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  icon: FunctionComponent<IconInterface>
  onPress: () => void
}
export const HeroButtonList: FunctionComponent<HeroButtonListProps> = (props) => {
  const Icon = styled(props.icon).attrs(({ theme }) => ({
    color: theme.colors.secondary,
    color2: theme.colors.primary,
    size: theme.icons.sizes.standard,
  }))``

  return (
    <ChoiceContainer onPress={props.onPress} testID={`HeroButtonList`}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <DescriptionContainer>
        {props.Title}
        {!!props.Subtitle && <SubtitleContainer>{props.Subtitle}</SubtitleContainer>}
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
  padding: getSpacing(4),
}))

const DescriptionContainer = styled.View({
  flex: 1,
  marginHorizontal: getSpacing(4),
})
const SubtitleContainer = styled.View({
  marginTop: getSpacing(1),
})

const IconContainer = styled.View({
  alignContent: 'center',
})
