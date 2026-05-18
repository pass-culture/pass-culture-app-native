import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { EligibilityType } from 'api/gen'
import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { isCurrentOrFormerBeneficiary } from 'features/auth/helpers/checkStatusType'
import { BeneficiaryAndEligibleForUpgradeHeader } from 'features/profile/components/Header/BeneficiaryAndEligibleForUpgradeHeader/BeneficiaryAndEligibleForUpgradeHeader'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { LoggedOutHeader } from 'features/profile/containers/ProfileLoggedOut/LoggedOutHeader/LoggedOutHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfile } from 'features/share/types'
import { getAge } from 'shared/user/getAge'

type ProfileHeaderProps = {
  user?: UserProfile
} & ProfileFeatureFlagsProps

export function ProfileHeader(props: ProfileHeaderProps) {
  const { featureFlags, user } = props
  const { isLoggedIn } = useAuthContext()

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader featureFlags={featureFlags} />
    }

    if (
      isCurrentOrFormerBeneficiary(user) &&
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
          statusType={user.statusType}
        />
      )
    }

    if (!isCurrentOrFormerBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade) {
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
          statusType={user.statusType}
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
