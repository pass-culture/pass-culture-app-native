import React from 'react'

import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { FreeHomeButton } from 'features/profile/components/Buttons/FreeHomeButton/FreeHomeButton'
import { HelpButton } from 'features/profile/components/Buttons/HelpButton/HelpButton'
import { GreySeparatorWithBorderDefaultColor } from 'features/profile/components/GreySeparatorWithBorderDefaultColor/GreySeparatorWithBorderDefaultColor'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { HighlightedBody } from 'features/profile/components/HighlightedBody/HighlightedBody'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { LoggedInExBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInExBeneficiaryHeader/LoggedInExBeneficiaryHeader'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { getAge } from 'shared/user/getAge'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const BeneficiaryEmptyHeader = ({ user, featureFlags }: Props) => {
  const { data } = useRemoteConfigQuery()
  const {
    firstName,
    lastName,
    birthDate,
    eligibilityType,
    depositExpirationDate,
    domainsCredit,
    eligibility,
  } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const isCreditEmpty = domainsCredit?.all.remaining === 0
  const isDepositExpired = getIsDepositExpired({ depositExpirationDate })
  const { sixteenYearsOldDeposit, seventeenYearsOldDeposit, eighteenYearsOldDeposit } =
    useDepositAmountsByAge()

  const incomingCreditMap: Record<number, string> = {
    15: sixteenYearsOldDeposit,
    16: seventeenYearsOldDeposit,
    17: eighteenYearsOldDeposit,
  }

  const isUserFreeStatus =
    eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_15 ||
    eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_16

  const nextCreditIntroText = isUserFreeStatus
    ? 'Tu pourras débloquer ton prochain crédit de '
    : 'Ton prochain crédit de '
  const nextCreditTimingText = isUserFreeStatus ? ' à ' : ' sera débloqué à '

  const age = getAge(birthDate)
  const ageToShowCreditV3 = age === 17 ? 17 : 16
  const isEighteenYearsOldOrMore = age && age >= 18

  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
    eligibility,
  })

  if (isEighteenYearsOldOrMore) {
    return <LoggedInExBeneficiaryHeader user={user} featureFlags={featureFlags} />
  }

  return (
    <ViewGap gap={6} testID="beneficiary-empty-header">
      <ViewGap gap={2}>
        <PageHeader title={title} featureFlags={featureFlags} numberOfLines={3} />
        <Subtitle {...subtitleProps} />
      </ViewGap>
      <ContainerHeader gap={6}>
        <Typo.Body>
          {nextCreditIntroText}
          <HighlightedBody>{incomingCreditMap[ageToShowCreditV3]}</HighlightedBody>
          {nextCreditTimingText}
          {ageToShowCreditV3 + 1} ans. En attendant…
        </Typo.Body>
        <FreeHomeButton homeId={data.homeEntryIdFreeOffers} />
        <GreySeparatorWithBorderDefaultColor />
        <HelpButton birthDate={birthDate} />
      </ContainerHeader>
    </ViewGap>
  )
}
