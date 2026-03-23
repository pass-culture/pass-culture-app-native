import type { Meta } from '@storybook/react-vite'
import React from 'react'

import {
  domains_credit_v3,
  domains_exhausted_credit_v3,
} from 'features/profile/fixtures/domainsCredit'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CreditHeader } from './CreditHeader'

const meta: Meta<typeof CreditHeader> = {
  title: 'features/profile/CreditHeader',
  component: CreditHeader,
}
export default meta

const depositExpirationDate = '2023-02-16T17:16:04.735235'

const featureFlags = { enablePassForAll: false, disableActivation: false }

const variantConfig: Variants<typeof CreditHeader> = [
  {
    label: 'CreditHeader with domain credit V3',
    props: {
      featureFlags: { ...featureFlags, enableProfileV2: false },
      firstName: 'Rosa',
      lastName: 'Bonheur',
      depositExpirationDate: depositExpirationDate,
      domainsCredit: domains_credit_v3,
      age: 18,
    },
  },
  {
    label: 'CreditHeader with domain credit V3 with enableProfileV2',
    props: {
      featureFlags: { ...featureFlags, enableProfileV2: true },
      firstName: 'Rosa',
      lastName: 'Bonheur',
      depositExpirationDate: depositExpirationDate,
      domainsCredit: domains_credit_v3,
      age: 18,
    },
  },
  {
    label: 'CreditHeader with exhausted credit',
    props: {
      featureFlags: { ...featureFlags, enableProfileV2: false },
      firstName: 'Rosa',
      lastName: 'Bonheur',
      depositExpirationDate: depositExpirationDate,
      domainsCredit: domains_exhausted_credit_v3,
      age: 18,
    },
  },
  {
    label: 'CreditHeader with exhausted credit with enableProfileV2',
    props: {
      featureFlags: { ...featureFlags, enableProfileV2: true },
      firstName: 'Rosa',
      lastName: 'Bonheur',
      depositExpirationDate: depositExpirationDate,
      domainsCredit: domains_exhausted_credit_v3,
      age: 18,
    },
  },
]

export const Template: VariantsStory<typeof CreditHeader> = {
  name: 'CreditHeader',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={CreditHeader} defaultProps={props} />
  ),
}
