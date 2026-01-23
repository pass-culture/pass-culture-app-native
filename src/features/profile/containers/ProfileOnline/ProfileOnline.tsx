import React from 'react'
import { NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { Footer } from 'features/profile/components/Footer/Footer'
import { ProfileLoggedIn } from 'features/profile/containers/ProfileLoggedIn/ProfileLoggedIn'
import { ProfileLoggedOut } from 'features/profile/containers/ProfileLoggedOut/ProfileLoggedOut'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Main } from 'shared/Main/Main'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Page } from 'ui/pages/Page'

export const ProfileOnline = () => {
  const { isLoggedIn, user } = useAuthContext()
  const isUserLoggedIn = isLoggedIn && user

  const featureFlags = {
    enableProfileV2: useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PROFILE_V2),
    enablePassForAll: useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL),
    disableActivation: useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION),
  }

  const logProfileScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)
  const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) logProfileScrolledToBottom()
  }

  return (
    <Page testID="profile-V2">
      <ScrollContainer onScroll={onScroll}>
        <CheatMenuButton />
        <Main>
          <Spacer.TopScreen />
          {isUserLoggedIn ? (
            <ProfileLoggedIn featureFlags={featureFlags} user={user} />
          ) : (
            <ProfileLoggedOut featureFlags={featureFlags} />
          )}
        </Main>
        <Footer />
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
