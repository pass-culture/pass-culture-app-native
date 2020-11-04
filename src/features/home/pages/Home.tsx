import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageModules } from 'features/home/api'
import { BusinessModule } from 'features/home/components/BusinessModule'
import { ExclusivityModule } from 'features/home/components/ExclusivityModule'
import { OffersModule } from 'features/home/components/OffersModule'
import {
  BusinessPane,
  ExclusivityPane,
  Offers,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: HomeScreenNavigationProp
}

export const Home: FunctionComponent<Props> = function ({ navigation }) {
  const { data: modules = [] } = useHomepageModules()
  return (
    <ScrollView>
      {env.ENV !== 'production' && (
        <CheatButtonsContainer>
          <CheatTouchableOpacity onPress={() => navigation.navigate('AppComponents')}>
            <Typo.Body>{_(t`Composants`)}</Typo.Body>
          </CheatTouchableOpacity>
          <CheatTouchableOpacity onPress={() => navigation.navigate('Navigation')}>
            <Typo.Body>{_(t`Navigation`)}</Typo.Body>
          </CheatTouchableOpacity>
        </CheatButtonsContainer>
      )}
      <CenterContainer>
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
      </CenterContainer>
      <Container>
        <Spacer.Column numberOfSpaces={8} />
        {modules.map((module: ProcessedModule, index: number) => {
          if (module instanceof Offers || module instanceof OffersWithCover) {
            return <OffersModule key={index} {...module} />
          }
          if (module instanceof ExclusivityPane) {
            return <ExclusivityModule key={module.offerId} {...module} />
          }
          if (module instanceof BusinessPane) {
            return <BusinessModule {...module} />
          }
          return <React.Fragment key={index} />
        })}
        <Spacer.Column numberOfSpaces={6} />
      </Container>
    </ScrollView>
  )
}

const CenterContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Container = styled.View({
  flex: 1,
  alignItems: 'flex-start',
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
})

const CheatButtonsContainer = styled.View({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
})

const CheatTouchableOpacity = styled(TouchableOpacity)({
  borderColor: ColorsEnum.BLACK,
  borderWidth: 2,
  padding: getSpacing(1),
})
