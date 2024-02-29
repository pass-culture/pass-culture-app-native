import React from 'react'
import { Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { TrackEmailChangeContentDeprecated } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContentDeprecated'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const HEADER_HEIGHT = getSpacing(8)

export function TrackEmailChange() {
  const enableNewChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_CHANGE_EMAIL)
  const { top } = useCustomSafeInsets()

  return (
    <StyledScrollViewContainer>
      <TopSpacer height={HEADER_HEIGHT + top} />
      <HeaderContainer>
        <Spacer.TopScreen />
        <GoBackContainer>
          <BackButton />
        </GoBackContainer>
      </HeaderContainer>
      <Spacer.Column numberOfSpaces={6} />
      <StyledTitleText>Suivi de ton changement d’e-mail</StyledTitleText>
      {enableNewChangeEmail ? <TrackEmailChangeContent /> : <TrackEmailChangeContentDeprecated />}
    </StyledScrollViewContainer>
  )
}

const TopSpacer = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  width: '100%',
  position: 'absolute',
  top: 0,
}))

const GoBackContainer = styled.View({
  justifyContent: 'center',
  height: HEADER_HEIGHT,
})
const StyledScrollViewContainer = styled(ScrollView)({
  padding: getSpacing(6),
  overflow: 'hidden',
  flex: 1,
})

const StyledTitleText = styled(Typo.Title1)({
  ...(Platform.OS === 'web' ? { textAlign: 'center' } : {}),
})
