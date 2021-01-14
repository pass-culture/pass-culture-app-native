import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface Props {
  title: string
}

export const PageHeader: React.FC<Props> = (props) => {
  const { title } = props
  const { goBack } = useNavigation()

  const HeaderIconBack = () => {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={goBack}>
        <ArrowPrevious color={ColorsEnum.WHITE} testID="icon-back" />
      </TouchableOpacity>
    )
  }

  return (
    <HeaderContainer>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={2} />
      <Row>
        <Spacer.Row numberOfSpaces={5} />
        <HeaderIconBack />
        <Spacer.Flex />
        <Title>
          <Typo.Body color={ColorsEnum.WHITE}>{title}</Typo.Body>
        </Title>
        <Spacer.Flex />
        <Spacer.Row numberOfSpaces={15} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  width: '100%',
  backgroundColor: ColorsEnum.PRIMARY,
})

const Title = styled.Text.attrs({ numberOfLines: 2 })({
  flexShrink: 1,
  textAlign: 'center',
})

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
