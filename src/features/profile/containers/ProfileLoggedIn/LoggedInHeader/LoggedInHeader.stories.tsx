import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
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
  title: 'features/profile/headers/LoggedInHeader',
}

export default meta

const commonProps = {
  featureFlags: {
    enablePassForAll: true,
    disableActivation: false,
    enableProfileV2: true,
  },
}

const beneficiaryUserWithEmptyCredit = {
  ...beneficiaryUser,
  domainsCredit: { all: { initial: 300, remaining: 0 } },
}

const freeBeneficiaryUser = {
  ...beneficiaryUser,
  creditType: UserCreditType.CREDIT_V3_15,
}

const eligibleUser = {
  ...nonBeneficiaryUser,
  eligibilityEndDatetime: '2023-11-19T11:00:00Z',
  statusType: UserStatusType.ELIGIBLE,
  eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_17,
}

const AllHeadersWrapper = () => (
  <ViewGap gap={6}>
    <Typo.BodyAccentXs>BeneficiaryEmptyHeader</Typo.BodyAccentXs>
    <BeneficiaryEmptyHeader user={beneficiaryUserWithEmptyCredit} {...commonProps} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>BeneficiaryFreeHeader</Typo.BodyAccentXs>
    <BeneficiaryFreeHeader user={freeBeneficiaryUser} {...commonProps} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>BeneficiaryHeader</Typo.BodyAccentXs>
    <BeneficiaryHeader user={beneficiaryUser} {...commonProps} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>EligibleHeader</Typo.BodyAccentXs>
    <EligibleHeader user={eligibleUser} {...commonProps} />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>LoggedInExBeneficiaryHeader</Typo.BodyAccentXs>
    <LoggedInExBeneficiaryHeader
      user={exBeneficiaryUser}
      {...commonProps}
      remoteConfigData={{ homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' }}
    />

    <Separator.HorizontalWithMargin />

    <Typo.BodyAccentXs>LoggedInGeneralPublicHeader</Typo.BodyAccentXs>
    <LoggedInGeneralPublicHeader user={nonBeneficiaryUser} {...commonProps} />
  </ViewGap>
)

export const AllHeadersStory: VariantsStory<typeof AllHeadersWrapper> = {
  name: 'LoggedInHeader',
  render: () => <AllHeadersWrapper />,
}
