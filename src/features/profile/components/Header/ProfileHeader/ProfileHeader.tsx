import React, { useMemo } from 'react'

import { EligibilityType } from 'api/gen'
import { CheatMenuButton } from 'cheatcodes/components/CheatMenuButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BeneficiaryAndEligibleForUpgradeHeader } from 'features/profile/components/Header/BeneficiaryAndEligibleForUpgradeHeader/BeneficiaryAndEligibleForUpgradeHeader'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'
import { Spacer } from 'ui/theme'

type ProfileHeaderProps = {
  featureFlags: {
    disableActivation: boolean
    enablePassForAll: boolean
  }
  user?: UserProfileResponseWithoutSurvey
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { featureFlags, user } = props
  const { isLoggedIn } = useAuthContext()

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader featureFlags={{ enablePassForAll: featureFlags.enablePassForAll }} />
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
      </React.Fragment>
    )
  }, [isLoggedIn, featureFlags, user])

  return (
    <React.Fragment>
      <CheatMenuButton />
      {ProfileHeader}
    </React.Fragment>
  )
}
