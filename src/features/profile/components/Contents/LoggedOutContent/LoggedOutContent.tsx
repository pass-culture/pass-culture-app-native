import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { loggedOutContentConfig } from 'features/profile/components/Contents/LoggedOutContent/loggedOutContentConfig'
import { HelpButton } from 'features/profile/components/HelpButton/HelpButton'
import { LocationButton } from 'features/profile/components/LocationButton/LocationButton'
import { createProfileContent } from 'features/profile/containers/createProfileContent'
import { useAppearanceTag } from 'features/profile/containers/useAppearanceTag'
import { useGeolocationSwitch } from 'features/profile/containers/useGeolocationSwitch'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const LoggedOutContent = ({ user }: Props) => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const { hasSeenAppearanceTag, markAppearanceTagSeen } = useAppearanceTag(enableDarkModeGtm)
  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { geolocPositionError } = useLocation()

  const config = loggedOutContentConfig({
    HelpButton: <HelpButton user={user} />,
    AppearanceButton: (
      <AppearanceButton
        navigate={navigate}
        enableDarkMode={enableDarkMode}
        enableDarkModeGtm={enableDarkModeGtm}
        hasSeenAppearanceTag={hasSeenAppearanceTag}
        markAppearanceTagSeen={markAppearanceTagSeen}
      />
    ),
    LocationButton: (
      <LocationButton
        isGeolocSwitchActive={isGeolocSwitchActive}
        geolocPositionError={geolocPositionError}
        switchGeolocation={switchGeolocation}
      />
    ),
  })

  return (
    <ViewWithMarginTop>
      {config
        .map((section) => {
          const filteredItems = section.items.filter(
            (item) => !item.excludePlatforms || !item.excludePlatforms.includes(Platform.OS)
          )
          if (filteredItems.length === 0) return null
          const items = filteredItems.map((item) => createProfileContent(item))
          return (
            <View key={section.section}>
              <CaptionNeutralInfo>{section.section}</CaptionNeutralInfo>
              <StyledSeparator />
              <AccessibleUnorderedList items={items} Separator={<React.Fragment />} />
            </View>
          )
        })
        .filter(Boolean)}
    </ViewWithMarginTop>
  )
}

const ViewWithMarginTop = styled.View(({ theme }) => ({
  marginTop: theme.contentPage.marginVertical,
}))

const CaptionNeutralInfo = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
