import React, { FunctionComponent, ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HeroButtonListProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  icon: FunctionComponent<IconInterface>
  navigateTo: TouchableLinkProps['navigateTo']
}
export const HeroButtonList: FunctionComponent<HeroButtonListProps> = (props) => {
  const Icon = styled(props.icon).attrs(({ theme }) => ({
    color: theme.colors.primary,
    color2: theme.colors.secondary,
    size: theme.icons.sizes.standard,
  }))``

  return (
    <ChoiceContainer navigateTo={props.navigateTo} testID={`HeroButtonList`}>
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

const ChoiceContainer = styled(TouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  border: getSpacing(0.25),
  borderRadius: getSpacing(1.8),
  borderColor: theme.colors.greySemiDark,
  minHeight: getSpacing(23),
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
