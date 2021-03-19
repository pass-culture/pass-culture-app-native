import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, FunctionComponent, useCallback } from 'react'
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { HomeBodyPlaceholder, SignUpSignInChoiceModal } from 'features/home/components'
import { HomeBody } from 'features/home/components/HomeBody'
import { useDisplayedHomeModules } from 'features/home/pages/useDisplayedHomeModules'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useModal } from 'ui/components/modals/useModal'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { RecommendationPane } from '../contentful/moduleTypes'

import { useShowSkeleton } from './useShowSkeleton'

const statusBarHeight = getStatusBarHeight(true)

export const Home: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { data: userInfos } = useUserProfileInfo()
  const { visible: signInModalVisible, showModal: showSignInModal, hideModal } = useModal(false)
  const showSkeleton = useShowSkeleton()
  const availableCredit = useAvailableCredit()
  const [recommendationY, setRecommendationY] = useState<number>(Infinity)
  const { displayedModules, algoliaModules, recommendedHits } = useDisplayedHomeModules()

  const logHasSeenAllModules = useFunctionOnce(() =>
    analytics.logAllModulesSeen(displayedModules.length)
  )

  const logHasSeenRecommendationModule = useFunctionOnce(() => {
    const recommendationModule = displayedModules.find((m) => m instanceof RecommendationPane)
    if (recommendationModule && recommendedHits.length > 0) {
      analytics.logRecommendationModuleSeen(
        (recommendationModule as RecommendationPane).display.title,
        recommendedHits.length
      )
    }
  })

  function hideSignInModal() {
    navigation.setParams({ shouldDisplayLoginModal: false })
    hideModal()
  }

  useFocusEffect(() => {
    if (params.shouldDisplayLoginModal) {
      showSignInModal()
    }
  })

  let subtitle = _(t`Toute la culture dans ta main`)
  if (availableCredit) {
    subtitle = availableCredit.isExpired
      ? _(t`Ton crédit est expiré`)
      : _(t`Tu as ${formatToFrenchDecimal(availableCredit.amount)} sur ton pass`)
  }

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) logHasSeenAllModules()
      const padding = nativeEvent.contentSize.height - recommendationY
      if (isCloseToBottom({ ...nativeEvent, padding })) logHasSeenRecommendationModule()
    },
    [recommendationY]
  )

  return (
    <ScrollView
      testID="homeScrollView"
      scrollEventThrottle={400}
      bounces={false}
      onScroll={onScroll}>
      <Spacer.TopScreen />
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      {env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && (
        <CheatCodeButtonContainer onPress={() => navigation.navigate('CheatMenu')}>
          <Text>{_(t`CheatMenu`)}</Text>
        </CheatCodeButtonContainer>
      )}

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
        <HomeBody
          modules={displayedModules}
          algoliaModules={algoliaModules}
          recommendedHits={recommendedHits}
          setRecommendationY={setRecommendationY}
        />
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

const CheatCodeButtonContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  position: 'absolute',
  right: getSpacing(2),
  top: getSpacing(3) + statusBarHeight,
  zIndex: 1,
  border: 1,
  padding: getSpacing(1),
})
