import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import {
  domains_credit_v1,
  domains_credit_v2,
} from 'features/profile/components/headers/fixtures/domainsCredit'
import { formatToSlashedFrenchDate } from 'libs/dates'

import { BeneficiaryHeaderNew } from './BeneficiaryHeaderNew'

export default {
  title: 'ui/BeneficiaryHeaderNew',
  component: BeneficiaryHeaderNew,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof BeneficiaryHeaderNew>

const Template: ComponentStory<typeof BeneficiaryHeaderNew> = (props) => (
  <BeneficiaryHeaderNew {...props} />
)

const depositExpirationDate = formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')

export const WithDomainCreditV1 = Template.bind({})
WithDomainCreditV1.args = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  depositExpirationDate: depositExpirationDate,
  domainsCredit: domains_credit_v1,
}

export const WithDomainCreditV2 = Template.bind({})
WithDomainCreditV2.args = {
  firstName: 'Rosa',
  lastName: 'Bonheur',
  depositExpirationDate: depositExpirationDate,
  domainsCredit: domains_credit_v2,
}
