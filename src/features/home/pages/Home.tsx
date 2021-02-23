import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, TouchableOpacity } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { HomeBodyPlaceholder, SignUpSignInChoiceModal } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useModal } from 'ui/components/modals/useModal'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { ZIndexes } from 'ui/theme/layers'

import { useShowSkeleton } from './useShowSkeleton'

const statusBarHeight = getStatusBarHeight(true)

export const Home: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { data: userInfos } = useUserProfileInfo()
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const showSkeleton = useShowSkeleton()
  const availableCredit = useAvailableCredit()

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

  const checkIfAllModulesHaveBeenSeen = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!hasSeenAllModules && isCloseToBottom(nativeEvent)) {
      setHasSeenAllModules(true)
      analytics.logAllModulesSeen(displayedModules.length)
    }
  }

  let subtitle = _(t`Toute la culture dans ta main`)
  if (availableCredit) {
    subtitle = availableCredit.isExpired
      ? _(t`Ton crédit est expiré`)
      : _(t`Tu as ${formatToFrenchDecimal(availableCredit.amount)} sur ton pass`)
  }

  return (
    <ScrollView
      testID="homeScrollView"
      scrollEventThrottle={400}
      bounces={false}
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
      <UserProfileContainer onPress={() => navigation.navigate('CheatMenu')}>
        <UserCircle size={32} color={ColorsEnum.WHITE} />
      </UserProfileContainer>

      <CenterContainer>
        <Spacer.Column numberOfSpaces={8} />
        <StyledTitle1 color={ColorsEnum.WHITE} numberOfLines={2}>
          {userInfos?.firstName
            ? _(/*i18n: Hello title message */ t`Bonjour ${userInfos?.firstName}`)
            : _(/*i18n: Welcome title message */ t`Bienvenue !`)}
        </StyledTitle1>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Body color={ColorsEnum.WHITE}>{subtitle}</Typo.Body>
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

const StyledTitle1 = styled(Typo.Title1)({
  textAlign: 'center',
  marginHorizontal: getSpacing(8),
})

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
