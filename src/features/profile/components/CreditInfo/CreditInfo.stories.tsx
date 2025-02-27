import { Meta } from '@storybook/react'
import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

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

const Template: VariantsStory<typeof CreditInfo> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={CreditInfo} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditInfo'
