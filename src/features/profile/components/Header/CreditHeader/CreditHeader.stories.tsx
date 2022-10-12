import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { domains_credit_v1, domains_credit_v2 } from 'features/profile/fixtures/domainsCredit'

import { CreditHeader } from './CreditHeader'

export default {
  title: 'ui/CreditHeader',
  component: CreditHeader,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof CreditHeader>

const Template: ComponentStory<typeof CreditHeader> = (props) => <CreditHeader {...props} />

const depositExpirationDate = '2023-02-16T17:16:04.735235'

// TODO(PC-17931): Fix this stories
const WithDomainCreditV1 = Template.bind({})
WithDomainCreditV1.args = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  depositExpirationDate: depositExpirationDate,
  domainsCredit: domains_credit_v1,
}

// TODO(PC-17931): Fix this stories
const WithDomainCreditV2 = Template.bind({})
WithDomainCreditV2.args = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  depositExpirationDate: depositExpirationDate,
  domainsCredit: domains_credit_v2,
}
