import React, { useMemo } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { AchievementBanner } from 'features/achievements/components/AchievementBanner'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { getAge } from 'shared/user/getAge'
import { Spacer, getSpacing } from 'ui/theme'

type ProfileHeaderProps = {
  featureFlags: {
    disableActivation: boolean
    enablePassForAll: boolean
  }
  user?: UserProfileResponse
}

const isWeb = Platform.OS === 'web'

export function ProfileHeader(props: ProfileHeaderProps) {
  const { featureFlags, user } = props
  const { isLoggedIn } = useAuthContext()

  const shouldShowAchievementsBanner = !isWeb && user?.isBeneficiary

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader featureFlags={{ enablePassForAll: featureFlags.enablePassForAll }} />
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
          firstName={user.firstName}
          lastName={user.lastName}
          age={getAge(user.birthDate)}
          domainsCredit={user.domainsCredit}
          depositExpirationDate={user.depositExpirationDate ?? undefined}
          eligibility={user.eligibility}
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
