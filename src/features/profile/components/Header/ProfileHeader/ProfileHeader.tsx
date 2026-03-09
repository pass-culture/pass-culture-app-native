import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { EligibilityType } from 'api/gen'
import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BeneficiaryAndEligibleForUpgradeHeader } from 'features/profile/components/Header/BeneficiaryAndEligibleForUpgradeHeader/BeneficiaryAndEligibleForUpgradeHeader'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { LoggedOutHeader } from 'features/profile/containers/ProfileLoggedOut/LoggedOutHeader/LoggedOutHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'

type ProfileHeaderProps = {
  user?: UserProfileResponseWithoutSurvey
} & ProfileFeatureFlagsProps

export function ProfileHeader(props: ProfileHeaderProps) {
  const { featureFlags, user } = props
  const { isLoggedIn } = useAuthContext()

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader featureFlags={featureFlags} />
    }

    if (
      user.isBeneficiary &&
      user.isEligibleForBeneficiaryUpgrade &&
      user.eligibility === EligibilityType['age-18']
    ) {
      return (
        <BeneficiaryAndEligibleForUpgradeHeader
          featureFlags={featureFlags}
          eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
          eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
          firstName={user.firstName}
          lastName={user.lastName}
          age={getAge(user.birthDate)}
          domainsCredit={user.domainsCredit}
          depositExpirationDate={user.depositExpirationDate ?? undefined}
          eligibility={user.eligibility}
        />
      )
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
      <CreditHeaderContainer>
        <CreditHeader
          firstName={user.firstName}
          lastName={user.lastName}
          age={getAge(user.birthDate)}
          domainsCredit={user.domainsCredit}
          depositExpirationDate={user.depositExpirationDate ?? undefined}
          eligibility={user.eligibility}
          featureFlags={featureFlags}
        />
      </CreditHeaderContainer>
    )
  }, [isLoggedIn, featureFlags, user])

  return (
    <React.Fragment>
      <CheatMenuButton />
      {ProfileHeader}
    </React.Fragment>
  )
}
const CreditHeaderContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
