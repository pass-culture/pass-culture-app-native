import React, { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface ProfileSectionProps {
  title: string
  style?: StyleProp<ViewStyle>
}

export function ProfileSection(props: PropsWithChildren<ProfileSectionProps>) {
  return (
    <Container style={props.style}>
      <Title>{props.title}</Title>
      <Separator />
      {props.children}
    </Container>
  )
}

const Container = styled(View)({
  paddingTop: getSpacing(2),
})

const Separator = styled.View({
  width: '100%',
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginTop: getSpacing(2),
})

const Title = styled(Typo.Body)({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
})
