import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CheatMenuButton } from 'features/internal/cheatcodes/components/CheatMenuButton'
import { BadgeBanner } from 'features/profile/components/Achievements/BadgeBanner'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAge } from 'shared/user/getAge'
import { Spacer, getSpacing } from 'ui/theme'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props
  const { isLoggedIn } = useAuthContext()

  const enableAchievements = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const shouldShowBadgesBanner = enableAchievements && user?.isBeneficiary

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader />
    }

    if (!user.isBeneficiary || user.isEligibleForBeneficiaryUpgrade) {
      return (
        <NonBeneficiaryHeader
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
        />
        <Spacer.Column numberOfSpaces={4} />
        {shouldShowBadgesBanner ? (
          <BadgeBannerContainer>
            <BadgeBanner />
          </BadgeBannerContainer>
        ) : null}
      </React.Fragment>
    )
  }, [isLoggedIn, shouldShowBadgesBanner, user])

  return (
    <React.Fragment>
      <CheatMenuButton />
      {ProfileHeader}
    </React.Fragment>
  )
}

const BadgeBannerContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(4),
}))
