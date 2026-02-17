import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { BannerName } from 'api/gen'
import { BeneficiaryFreeHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/BeneficiaryFreeHeader'
import { BeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/BeneficiaryHeader'
import { EligibleHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/EligibleHeader'
import { LoggedInExBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInExBeneficiaryHeader/LoggedInExBeneficiaryHeader'
import { LoggedInGeneralPublicHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInGeneralPublicHeader/LoggedInGeneralPublicHeader'
import { beneficiaryUser, exBeneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { BeneficiaryEmptyHeader } from './LoggedInBeneficiaryHeader/BeneficiaryEmptyHeader'

const meta: Meta = {
  title: 'features/profile/headers/loggedInHeader',
}

export default meta

const featureFlags = {
  enablePassForAll: true,
  disableActivation: false,
  enableProfileV2: true,
}

const AllHeadersWrapper = () => (
  <ViewGap gap={6}>
    <Typo.BodyAccentXs>BeneficiaryEmptyHeader</Typo.BodyAccentXs>
    <BeneficiaryEmptyHeader user={beneficiaryUser} featureFlags={featureFlags} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>BeneficiaryFreeHeader</Typo.BodyAccentXs>
    <BeneficiaryFreeHeader user={beneficiaryUser} featureFlags={featureFlags} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>BeneficiaryHeader</Typo.BodyAccentXs>
    <BeneficiaryHeader user={beneficiaryUser} featureFlags={featureFlags} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>EligibleHeader</Typo.BodyAccentXs>
    <EligibleHeader
      user={beneficiaryUser}
      featureFlags={featureFlags}
      banner={{
        title: 'Débloque tes 150€',
        text: 'à dépenser sur l’application',
        name: BannerName.activation_banner,
      }}
      onPress={() => 'doNothing'}
    />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>LoggedInExBeneficiaryHeader</Typo.BodyAccentXs>
    <LoggedInExBeneficiaryHeader user={exBeneficiaryUser} featureFlags={featureFlags} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>LoggedInExBeneficiaryHeader</Typo.BodyAccentXs>
    <LoggedInGeneralPublicHeader user={nonBeneficiaryUser} featureFlags={featureFlags} />
  </ViewGap>
)

export const AllHeadersStory: VariantsStory<typeof AllHeadersWrapper> = {
  name: 'loggedInHeader',
  render: () => <AllHeadersWrapper />,
}
