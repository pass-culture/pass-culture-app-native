import React from 'react'
import { useTheme } from 'styled-components/native'

import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { Typo } from 'ui/theme'

export const ExBeneficiaryBanner = () => {
  const { designSystem } = useTheme()
  const { data } = useRemoteConfigQuery()

  return (
    <InternalTouchableLink
      testID="ex-beneficiary-banner"
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
  )
}
