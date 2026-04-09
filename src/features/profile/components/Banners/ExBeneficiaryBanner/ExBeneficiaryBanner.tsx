import React from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { Typo } from 'ui/theme'

type Props = { remoteConfigData: { homeEntryIdFreeOffers: string } }

export const ExBeneficiaryBanner = ({ remoteConfigData }: Props) => {
  return (
    <InternalTouchableLink
      testID="ex-beneficiary-banner"
      navigateTo={{
        screen: 'ThematicHome',
        params: { homeId: remoteConfigData.homeEntryIdFreeOffers, from: 'profile' },
      }}>
      <GenericBanner LeftIcon={<LeftIcon />}>
        <ViewGap gap={2}>
          <Typo.BodyAccent>L’aventure continue&nbsp;!</Typo.BodyAccent>
          <Typo.Body>Tu peux profiter d’offres gratuites autour de toi.</Typo.Body>
        </ViewGap>
      </GenericBanner>
    </InternalTouchableLink>
  )
}

const LeftIcon = styled(Offers).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
