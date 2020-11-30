import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { RetryBoundary } from 'features/errors'
import { useUserProfileInfo } from 'features/home/api'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { logAllModulesSeen } from 'libs/analytics'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { useModal } from 'ui/components/modals/useModal'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { ZIndexes } from 'ui/theme/layers'

import { HomeBody } from '../components/HomeBody'
import { HomeBodyPlaceholder } from '../components/HomeBodyPlaceholder'
import { SignUpSignInChoiceModal } from '../components/SignUpSignInChoiceModal'

import { useShowSkeleton } from './useShowSkeleton'

const statusBarHeight = getStatusBarHeight(true)

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}

export const HomeComponent: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { data: userInfos } = useUserProfileInfo()
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const showSkeleton = useShowSkeleton()

  const [hasSeenAllModules, setHasSeenAllModules] = useState<boolean>(false)
  const { displayedModules, algoliaModules } = useDisplayedHomeModules()

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

  const checkIfAllModulesHaveBeenSeen = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasSeenAllModules && isCloseToBottom(nativeEvent)) {
      setHasSeenAllModules(true)
      logAllModulesSeen(displayedModules.length)
    }
  }

  return (
    <ScrollView
      testID="homeScrollView"
      scrollEventThrottle={400}
      onScroll={checkIfAllModulesHaveBeenSeen}>
      <Spacer.TopScreen />
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

      <CenterContainer>
        <Spacer.Column numberOfSpaces={8} />
        <Typo.Title1 color={ColorsEnum.WHITE}>
          {_(
            /*i18n: Welcome title message */ t`${
              userInfos?.first_name ? 'Bonjour' : 'Bienvenue !'
            } ${userInfos?.first_name}`
          )}
        </Typo.Title1>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Body color={ColorsEnum.WHITE}>
          {_(/*i18n: Welcome body message */ t`Toute la culture dans votre main`)}
        </Typo.Body>
      </CenterContainer>
      <Spacer.Column numberOfSpaces={6} />

      {showSkeleton ? <HomeBodyPlaceholder /> : null}
      <HomeBodyLoadingContainer isLoading={showSkeleton}>
        <HomeBody modules={displayedModules} algoliaModules={algoliaModules} />
      </HomeBodyLoadingContainer>

      <SignUpSignInChoiceModal visible={signInModalVisible} dismissModal={hideSignInModal} />
      <Spacer.TabBar />
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

const HomeBodyLoadingContainer = styled.View<{ isLoading: boolean }>(({ isLoading }) => ({
  height: isLoading ? 0 : undefined,
  overflow: 'hidden',
}))

const CheatButtonsContainer = styled.View({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
  zIndex: ZIndexes.HomeCheatButton,
  top: 20,
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

export const Home = withErrorBoundary(React.memo(HomeComponent), {
  FallbackComponent: RetryBoundary,
})
