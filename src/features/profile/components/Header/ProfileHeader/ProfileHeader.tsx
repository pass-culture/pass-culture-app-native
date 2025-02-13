import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { AchievementBanner } from 'features/achievements/components/AchievementBanner'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { getAge } from 'shared/user/getAge'
import { Spacer, getSpacing } from 'ui/theme'

type ProfileHeaderProps = {
  featureFlags: {
    enableAchievements: boolean
    enableSystemBanner: boolean
    disableActivation: boolean
    showRemoteBanner: boolean
    enablePassForAll: boolean
  }
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { featureFlags, user } = props
  const { isLoggedIn } = useAuthContext()

  const { displayAchievements } = useRemoteConfigContext()
  const shouldShowAchievementsBanner =
    featureFlags.enableAchievements && displayAchievements && user?.isBeneficiary

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader showRemoteBanner={featureFlags.showRemoteBanner} />
    }

    if (!user.isBeneficiary || user.isEligibleForBeneficiaryUpgrade) {
      return (
        <NonBeneficiaryHeader
          featureFlags={featureFlags}
          eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
          eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
        />
      )
    }

    return (
      <React.Fragment>
        <CreditHeader
          showRemoteBanner={featureFlags.showRemoteBanner}
          firstName={user.firstName}
          lastName={user.lastName}
          age={getAge(user.birthDate)}
          domainsCredit={user.domainsCredit}
          depositExpirationDate={user.depositExpirationDate ?? undefined}
        />
        <Spacer.Column numberOfSpaces={4} />
        {shouldShowAchievementsBanner ? (
          <AchievementBannerContainer>
            <AchievementBanner />
          </AchievementBannerContainer>
        ) : null}
      </React.Fragment>
    )
  }, [isLoggedIn, featureFlags, shouldShowAchievementsBanner, user])

  return (
    <React.Fragment>
      <CheatMenuButton />
      {ProfileHeader}
    </React.Fragment>
  )
}

const AchievementBannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(4),
  width: theme.isDesktopViewport ? 'fit-content' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))
