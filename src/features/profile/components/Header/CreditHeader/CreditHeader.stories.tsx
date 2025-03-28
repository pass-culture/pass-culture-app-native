import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
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
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const depositExpirationDate = '2023-02-16T17:16:04.735235'

const variantConfig: Variants<typeof CreditHeader> = [
  {
    label: 'CreditHeader with domain credit V3',
    props: {
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
      firstName: 'Rosa',
      lastName: 'Bonheur',
      depositExpirationDate: depositExpirationDate,
      domainsCredit: domains_exhausted_credit_v3,
      age: 18,
    },
  },
]

const Template: VariantsStory<typeof CreditHeader> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={CreditHeader} defaultProps={{ ...args }} />
)

const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditHeader'
