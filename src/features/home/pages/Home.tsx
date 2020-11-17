import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { ScrollView, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import { useIsLoggedIn } from 'features/auth/api'
import { useListenDeepLinksEffect } from 'features/deeplinks'
import { RetryBoundary } from 'features/errors'
import { useHomepageModules } from 'features/home/api'
import { UseNavigationType, UseRouteType } from 'features/home/navigation/HomeNavigator'
import { env } from 'libs/environment'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { useModal } from 'ui/components/modals/useModal'
import { SafeContainer } from 'ui/components/SafeContainer'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { HomeBody } from '../components/HomeBody'
import { SignUpSignInChoiceModal } from '../components/SignUpSignInChoiceModal'

const statusBarHeight = getStatusBarHeight(true)

export const HomeComponent: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { data: modules = [] } = useHomepageModules()
  const position = useGeolocation()
  const { data: connected = false } = useIsLoggedIn()

  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)

  function hideSignInModal() {
    navigation.setParams({ shouldDisplayLoginModal: false })
    hideModal()
  }

  useFocusEffect(() => {
    if (params.shouldDisplayLoginModal) {
      showSignInModal()
    }
  })

  useListenDeepLinksEffect()

  return (
    <ScrollView>
      {env.CHEAT_BUTTONS_ENABLED && (
        <CheatButtonsContainer>
          <CheatTouchableOpacity onPress={() => navigation.navigate('AppComponents')}>
            <Typo.Body>{_(t`Composants`)}</Typo.Body>
          </CheatTouchableOpacity>
          <CheatTouchableOpacity onPress={() => navigation.navigate('Navigation')}>
            <Typo.Body>{_(t`Navigation`)}</Typo.Body>
          </CheatTouchableOpacity>
        </CheatButtonsContainer>
      )}
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <UserProfileContainer onPress={showSignInModal}>
        <UserCircle size={32} color={ColorsEnum.WHITE} />
      </UserProfileContainer>
      <SafeContainer>
        <CenterContainer>
          <Spacer.Column numberOfSpaces={8} />
          <Typo.Title1 color={ColorsEnum.WHITE}>
            {_(/*i18n: Welcome title message */ t`Bienvenue !`)}
          </Typo.Title1>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body color={ColorsEnum.WHITE}>
            {_(/*i18n: Welcome body message */ t`Toute la culture dans votre main`)}
          </Typo.Body>
        </CenterContainer>
        <Spacer.Column numberOfSpaces={6} />

        <HomeBody modules={modules} connected={connected} position={position} />

        <SignUpSignInChoiceModal visible={signInModalVisible} dismissModal={hideSignInModal} />
        <Spacer.TabBar />
      </SafeContainer>
    </ScrollView>
  )
}

const CenterContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
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
  top: getSpacing(3) + statusBarHeight,
  zIndex: 1,
})

const CheatTouchableOpacity = styled(TouchableOpacity)({
  borderColor: ColorsEnum.BLACK,
  borderWidth: 2,
  padding: getSpacing(1),
})

export const Home = withErrorBoundary(HomeComponent, {
  FallbackComponent: RetryBoundary,
})
