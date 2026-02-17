import React from 'react'

import { FreeHomeButton } from 'features/profile/components/Buttons/FreeHomeButton/FreeHomeButton'
import { HelpButton } from 'features/profile/components/Buttons/HelpButton/HelpButton'
import { GreySeparatorWithBorderDefaultColor } from 'features/profile/components/GreySeparatorWithBorderDefaultColor/GreySeparatorWithBorderDefaultColor'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { HighlightedBody } from 'features/profile/components/HighlightedBody/HighlightedBody'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const BeneficiaryFreeHeader = ({ featureFlags, user }: Props) => {
  const { data } = useRemoteConfigQuery()
  const { seventeenYearsOldDeposit } = useDepositAmountsByAge()
  const { firstName, lastName, birthDate } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const deposit = <HighlightedBody>{seventeenYearsOldDeposit}</HighlightedBody>

  return (
    <ViewGap gap={6} testID="beneficiary-free-header">
      <PageHeader title={title} featureFlags={featureFlags} numberOfLines={3} />
      <ContainerHeader gap={6}>
        <Typo.Body>
          Tu pourras débloquer ton prochain crédit de {deposit} à 17 ans. En attendant…
        </Typo.Body>
        <FreeHomeButton homeId={data.homeEntryIdFreeOffers} />
        <GreySeparatorWithBorderDefaultColor />
        <HelpButton birthDate={birthDate} />
      </ContainerHeader>
    </ViewGap>
  )
}
