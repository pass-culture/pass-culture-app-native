import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface ProfileSectionProps {
  title: string
}

export function ProfileSection(props: PropsWithChildren<ProfileSectionProps>) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <Separator />
      <View>{props.children}</View>
    </Container>
  )
}

const Container = styled.View({
  marginVertical: getSpacing(1),
})

const Separator = styled.View({
  width: '100%',
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT, // ecf0f1
  marginVertical: getSpacing(1),
})

const Title = styled(Typo.Body)({
  fontSize: 12,
  fontFamily: 'Montserrat-Medium',
})
