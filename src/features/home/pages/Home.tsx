import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
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
import { useModal } from 'ui/components/modals/useModal'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { SignUpSignInChoiceModal } from '../components/SignUpSignInChoiceModal'

type Props = StackScreenProps<RootStackParamList, 'Home'>

export const Home: FunctionComponent<Props> = function ({ navigation, route }: Props) {
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const { data: modules = [] } = useHomepageModules()

  function hideSignInModal() {
    navigation.setParams({ shouldDisplayLoginModal: false })
    hideModal()
  }

  useFocusEffect(() => {
    if (route.params.shouldDisplayLoginModal) {
      showSignInModal()
    }
  })

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
          <UserProfileContainer onPress={showSignInModal}>
            <UserCircle size={32} color={ColorsEnum.WHITE} />
          </UserProfileContainer>
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
      <SignUpSignInChoiceModal visible={signInModalVisible} dismissModal={hideSignInModal} />
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

const UserProfileContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  position: 'absolute',
  right: 24,
  top: 20,
})

const CheatTouchableOpacity = styled(TouchableOpacity)({
  borderColor: ColorsEnum.BLACK,
  borderWidth: 2,
  padding: getSpacing(1),
})
