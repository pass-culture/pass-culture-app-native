import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageModules } from 'features/home/api'
import { ExclusivityModule } from 'features/home/components/ExclusivityModule'
import { ExclusivityPane, ProcessedModule } from 'features/home/contentful'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { useGeolocation, CoordinatesView } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: HomeScreenNavigationProp
}

export const Home: FunctionComponent<Props> = function ({ navigation }) {
  const position = useGeolocation()
  const { data: modules = [] } = useHomepageModules()

  const goToLoginPage = useCallback((): void => {
    navigation.navigate('Login')
  }, [])

  return (
    <ScrollView>
      <Container>
        <HeaderBackgroundWrapper>
          <HeaderBackground />
        </HeaderBackgroundWrapper>
        <Spacer.Column numberOfSpaces={18} />
        <Typo.Title1 color={ColorsEnum.WHITE}>
          {_(/*i18n: Welcome title message */ t`Bienvenue !`)}
        </Typo.Title1>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Body color={ColorsEnum.WHITE}>
          {_(/*i18n: Welcome body message */ t`Toute la culture dans votre main`)}
        </Typo.Body>
        <Spacer.Column numberOfSpaces={8} />
        {modules.map((module: ProcessedModule, index: number) => {
          if (module instanceof ExclusivityPane) {
            return <ExclusivityModule key={module.offerId} {...module} />
          }
          return <React.Fragment key={index} />
        })}
        <Spacer.Column numberOfSpaces={6} />
        <Button title={_(t`Aller sur la page de connexion`)} onPress={goToLoginPage} />
        <Spacer.Column numberOfSpaces={6} />
        <CoordinatesViewContainer position={position} />
        <Spacer.Column numberOfSpaces={6} />
      </Container>
    </ScrollView>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const CoordinatesViewContainer = styled(CoordinatesView)({
  position: 'absolute',
  alignItems: 'center',
  bottom: 50,
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
})
