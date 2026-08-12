import React, { useEffect, useRef, useCallback } from 'react'
import { NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { DebugButton } from 'features/profile/components/Buttons/DebugButton/DebugButton'
import { Version } from 'features/profile/components/Version/Version'
import { ProfileLoggedIn } from 'features/profile/containers/ProfileLoggedIn/ProfileLoggedIn'
import { ProfileLoggedOut } from 'features/profile/containers/ProfileLoggedOut/ProfileLoggedOut'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { Main } from 'shared/Main/Main'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { useDebounce } from 'ui/hooks/useDebounce'
import { useVersion } from 'ui/hooks/useVersion'
import { Page } from 'ui/pages/Page'

export const ProfileOnline = () => {
  const { isLoggedIn, user } = useAuthContext()
  const isUserLoggedIn = isLoggedIn && user

  const version = useVersion()
  const commitHash = env.COMMIT_HASH

  const scrollRef = useRef<ScrollView | null>(null)
  const scrollToTop = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [])
  const debouncedScrollToTop = useDebounce(scrollToTop, 400)

  useEffect(() => {
    if (!isLoggedIn) debouncedScrollToTop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const featureFlags = {
    disableActivation: useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION),
  }

  const logProfileScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)
  const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) logProfileScrolledToBottom()
  }

  return (
    <Page testID="profile-V2">
      <ScrollContainer ref={scrollRef} onScroll={onScroll}>
        <CheatMenuButton />
        <ViewGap gap={5}>
          <Main>
            <Spacer.TopScreen />
            {isUserLoggedIn ? (
              <ProfileLoggedIn featureFlags={featureFlags} user={user} />
            ) : (
              <ProfileLoggedOut user={user} featureFlags={featureFlags} />
            )}
            <ViewGap gap={5}>
              <Separator.Horizontal />
              <Version version={version} commitHash={commitHash} />
              <ButtonContainerFlexStart>
                <DebugButton />
              </ButtonContainerFlexStart>
            </ViewGap>
          </Main>
          <AccessibilityFooter />
        </ViewGap>
      </ScrollContainer>
    </Page>
  )
}

const DISABLE_THROTTLE_SCROLLING = 16
const ScrollContainer = styled(ScrollView).attrs(({ theme }) => ({
  testID: 'profile-scrollview',
  bounces: true,
  scrollEventThrottle: DISABLE_THROTTLE_SCROLLING,
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
  },
}))``
