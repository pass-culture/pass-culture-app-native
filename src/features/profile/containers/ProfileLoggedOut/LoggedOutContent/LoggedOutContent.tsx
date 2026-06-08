import React from 'react'

import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { BugReportButton } from 'features/profile/components/Buttons/BugReportButton/BugReportButton'
import { HelpButtonRow } from 'features/profile/components/Buttons/HelpButton/HelpButtonRow'
import { LocationButton } from 'features/profile/components/Buttons/LocationButton/LocationButton'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { loggedOutContentConfig } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/loggedOutContentConfig'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { UserProfile } from 'features/share/types'
import { useLocation } from 'libs/location/useLocation'

type Props = { user: UserProfile | undefined }

export const LoggedOutContent = ({ user }: Props) => {
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })
  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { geolocPositionError } = useLocation()

  const config = loggedOutContentConfig({
    HelpButton: shouldDisplayHelpButton ? <HelpButtonRow birthDate={user?.birthDate} /> : null,
    AppearanceButton: <AppearanceButton />,
    LocationButton: (
      <LocationButton
        isGeolocSwitchActive={isGeolocSwitchActive}
        geolocPositionError={geolocPositionError}
        switchGeolocation={switchGeolocation}
      />
    ),
    ShareBanner: <ShareBanner />,
    SocialNetwork: <SocialNetwork />,
    BugReportButton: <BugReportButton />,
  })

  return <ProfileContentLayout config={config} testID="logged-out-content" />
}
