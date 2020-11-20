import React, { FunctionComponent } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SafeContainer } from 'ui/components/SafeContainer'
import { Background } from 'ui/svg/Background'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  icon: FunctionComponent<IconInterface>
  title: string
}

export const GenericInfoPage: FunctionComponent<Props> = (props) => {
  return (
    <SafeContainer noTabBarSpacing>
      <Background />
      <ScrollView contentContainerStyle={scrollViewContentContainerStyle}>
        <Spacer.Column numberOfSpaces={18} />
        <props.icon color={ColorsEnum.WHITE} size={100} />
        <Spacer.Column numberOfSpaces={9} />
        <StyledTitle2>{props.title}</StyledTitle2>
        <Spacer.Column numberOfSpaces={5} />
        {props.children}
      </ScrollView>
      <Spacer.TabBar />
    </SafeContainer>
  )
}

const scrollViewContentContainerStyle: ViewStyle = {
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  width: '90%',
  maxWidth: getSpacing(125),
}

const StyledTitle2 = styled(Typo.Title2).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
