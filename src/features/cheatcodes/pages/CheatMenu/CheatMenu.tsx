import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CheatMenu: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <PageHeader title="Cheater Zone" withGoBackButton />
      <Spacer.Flex />
      <React.Fragment>
        <Spacer.Column numberOfSpaces={8} />
        <CheatTouchableOpacity onPress={() => navigate('AppComponents')}>
          <Typo.Body>Composants</Typo.Body>
        </CheatTouchableOpacity>
        <Spacer.Column numberOfSpaces={8} />
        <CheatTouchableOpacity onPress={() => navigate('Navigation')}>
          <Typo.Body>Navigation</Typo.Body>
        </CheatTouchableOpacity>
      </React.Fragment>
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  backgroundColor: theme.colors.white,
}))

const CheatTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  borderColor: theme.colors.black,
  borderWidth: 2,
  padding: getSpacing(1),
}))
