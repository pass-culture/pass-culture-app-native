import React from 'react'
import { View } from 'react-native'

import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { HelpButton } from 'features/profile/components/Buttons/HelpButton/HelpButton'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { GreySeparatorWithBorderDefaultColor } from 'features/profile/components/GreySeparatorWithBorderDefaultColor/GreySeparatorWithBorderDefaultColor'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { IncomingCreditInfo } from 'features/profile/components/IncomingCreditInfo/IncomingCreditInfo'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const BeneficiaryHeader = ({ user, featureFlags }: Props) => {
  const { firstName, lastName, domainsCredit, depositExpirationDate, eligibility, birthDate } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const depositAmount = useDepositAmountsByAge()
  const isCreditEmpty = domainsCredit?.all.remaining === 0
  const isDepositExpired = getIsDepositExpired({ depositExpirationDate })
  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
    eligibility,
  })

  return (
    <ViewGap gap={6} testID="beneficiary-header">
      <ViewGap gap={2}>
        <PageHeader title={title} featureFlags={featureFlags} numberOfLines={3} />
        <Subtitle {...subtitleProps} />
      </ViewGap>
      <ContainerHeader gap={6}>
        <View>
          <CreditInfo totalCredit={domainsCredit?.all} />
          <BeneficiaryCeilings domainsCredit={domainsCredit} />
        </View>
        <IncomingCreditInfo
          birthDate={birthDate}
          seventeenYearsOldDeposit={depositAmount.seventeenYearsOldDeposit}
          eighteenYearsOldDeposit={depositAmount.eighteenYearsOldDeposit}
        />
        <GreySeparatorWithBorderDefaultColor />
        <HelpButton birthDate={birthDate} />
      </ContainerHeader>
    </ViewGap>
  )
}
