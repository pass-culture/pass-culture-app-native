import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/home/navigation/HomeNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const Profile: React.FC = () => {
  const navigation = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Spacer.Flex />
      <Typo.Hero>{_(t`Profile`)}</Typo.Hero>
      {env.ENV !== 'production' && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={8} />
          <CheatTouchableOpacity onPress={() => navigation.navigate('AppComponents')}>
            <Typo.Body>{_(t`Composants`)}</Typo.Body>
          </CheatTouchableOpacity>
          <Spacer.Column numberOfSpaces={8} />
          <CheatTouchableOpacity onPress={() => navigation.navigate('Navigation')}>
            <Typo.Body>{_(t`Navigation`)}</Typo.Body>
          </CheatTouchableOpacity>
        </React.Fragment>
      )}
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })

const CheatTouchableOpacity = styled.TouchableOpacity({
  borderColor: ColorsEnum.BLACK,
  borderWidth: 2,
  padding: getSpacing(1),
})
