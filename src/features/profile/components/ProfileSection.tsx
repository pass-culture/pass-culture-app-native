import React, { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

import { Separator } from './reusables'

interface ProfileSectionProps {
  title?: string
  style?: StyleProp<ViewStyle>
}

export function ProfileSection(props: PropsWithChildren<ProfileSectionProps>) {
  return (
    <Container style={props.style}>
      {props.title && <Title>{props.title}</Title>}
      <Separator />
      {props.children}
    </Container>
  )
}

const Container = styled(View)({
  paddingTop: getSpacing(2),
})

const Title = styled(Typo.Body)({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
  paddingBottom: getSpacing(2),
})
