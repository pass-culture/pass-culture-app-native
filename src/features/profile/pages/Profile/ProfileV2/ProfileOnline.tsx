import React from 'react'
import { NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { Footer } from 'features/profile/components/Footer/Footer'
import { ProfileLoggedIn } from 'features/profile/pages/Profile/ProfileV2/ProfileLoggedIn'
import { ProfileLoggedOut } from 'features/profile/pages/Profile/ProfileV2/ProfileLoggedOut'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Main } from 'shared/Main/Main'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Page } from 'ui/pages/Page'

type Props = {
  featureFlags: { enableProfileV2: boolean }
  user?: UserProfileResponseWithoutSurvey
  isLoggedIn: boolean
}

export const ProfileOnline: React.FC<Props> = ({ featureFlags, user, isLoggedIn }) => {
  const logProfilScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)
  const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) logProfilScrolledToBottom()
  }

  const isUserLoggedIn = isLoggedIn && user

  return (
    <Page>
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
