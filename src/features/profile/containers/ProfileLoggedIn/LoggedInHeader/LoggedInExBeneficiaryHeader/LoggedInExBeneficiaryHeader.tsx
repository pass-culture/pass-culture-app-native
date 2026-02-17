import React from 'react'
import { useTheme } from 'styled-components/native'

import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { Typo } from 'ui/theme'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInExBeneficiaryHeader = ({ user, featureFlags }: Props) => {
  const { designSystem } = useTheme()
  const { data } = useRemoteConfigQuery()
  const { firstName, lastName, domainsCredit, depositExpirationDate, eligibility } = user
  const headerTitle = getProfileHeaderTitle({ firstName, lastName })
  const isCreditEmpty = domainsCredit?.all.remaining === 0
  const isDepositExpired = getIsDepositExpired({ depositExpirationDate })
  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
    eligibility,
  })

  return (
    <ViewGap gap={6} testID="logged-in-ex-beneficiary-header">
      <ViewGap gap={2}>
        <PageHeader title={headerTitle} featureFlags={featureFlags} numberOfLines={3} />
        <Subtitle {...subtitleProps} />
      </ViewGap>
      <InternalTouchableLink
        navigateTo={{
          screen: 'ThematicHome',
          params: { homeId: data.homeEntryIdFreeOffers, from: 'profile' },
        }}>
        <GenericBanner LeftIcon={<Offers color={designSystem.color.icon.brandPrimary} />}>
          <ViewGap gap={2}>
            <Typo.BodyAccent>L’aventure continue&nbsp;!</Typo.BodyAccent>
            <Typo.Body>Tu peux profiter d’offres gratuites autour de toi.</Typo.Body>
          </ViewGap>
        </GenericBanner>
      </InternalTouchableLink>
    </ViewGap>
  )
}
