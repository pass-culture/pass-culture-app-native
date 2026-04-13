import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { isCurrentOrFormerBeneficiary } from 'features/auth/helpers/checkStatusType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { getShouldDisplayActivationFlow } from 'features/auth/helpers/getShouldDisplayActivationFlow'
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
    const shouldDisplayActivationFlow =
      user &&
      getShouldDisplayActivationFlow({
        eligibilityType: user?.eligibilityType,
        creditType: user?.creditType,
      })

    if (!isLoggedIn || !user) {
      return <LoggedOutHeader featureFlags={featureFlags} />
    }

    if (
      isCurrentOrFormerBeneficiary(user) &&
      shouldDisplayActivationFlow &&
      user.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V2_18
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
          statusType={user.statusType}
          eligibilityType={user.eligibilityType}
        />
      )
    }

    if (!isCurrentOrFormerBeneficiary(user) || shouldDisplayActivationFlow) {
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
          eligibilityType={user.eligibilityType}
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
