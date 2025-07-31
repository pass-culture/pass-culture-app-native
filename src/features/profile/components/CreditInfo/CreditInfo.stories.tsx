import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { VariantsTemplate, type Variants, VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CreditInfo } from './CreditInfo'

export default {
  title: 'Features/Profile/CreditInfo',
  component: CreditInfo,
} as Meta<typeof CreditInfo>

const variantConfig: Variants<typeof CreditInfo> = [
  {
    label: 'CreditInfo',
    props: {
      totalCredit: beneficiaryUser.domainsCredit?.all,
    },
  },
]

export const Template: VariantsStory<typeof CreditInfo> = {
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={CreditInfo} defaultProps={props} />
  ),
  name: 'CreditInfo',
}
