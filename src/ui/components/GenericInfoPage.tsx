import React, { FunctionComponent } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { Background } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  icon: FunctionComponent<IconInterface>
  iconSize?: number
  title: string
}

export const GenericInfoPage: FunctionComponent<Props> = (props) => {
  const { icon: Icon, iconSize = getSpacing(25), title } = props
  return (
    <React.Fragment>
      <Background />
      <ScrollView contentContainerStyle={scrollViewContentContainerStyle}>
        <Spacer.Column numberOfSpaces={18} />
        <Icon color={ColorsEnum.WHITE} size={iconSize} />
        <Spacer.Column numberOfSpaces={9} />
        <StyledTitle2>{title}</StyledTitle2>
        <Spacer.Column numberOfSpaces={5} />
        {props.children}
        <Spacer.BottomScreen />
      </ScrollView>
    </React.Fragment>
  )
}

const scrollViewContentContainerStyle: ViewStyle = {
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
}

const StyledTitle2 = styled(Typo.Title2).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
