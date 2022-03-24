import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

export default {
  title: 'ui/BeneficiaryCeilings',
  component: BeneficiaryCeilings,
} as ComponentMeta<typeof BeneficiaryCeilings>

const Template: ComponentStory<typeof BeneficiaryCeilings> = (args) => (
  <BeneficiaryCeilings {...args} />
)

const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

const domains_exhausted_credit_v1 = {
  all: { initial: 50000, remaining: 0 },
  physical: { initial: 30000, remaining: 0 },
  digital: { initial: 30000, remaining: 0 },
}

const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

const domains_credit_underage = {
  all: { initial: 3000, remaining: 1000 },
}

const domains_exhausted_credit_underage = {
  all: { initial: 3000, remaining: 0 },
}

export const Default = Template.bind({})
Default.args = {
  domainsCredit: domains_credit_v1,
  isUserUnderageBeneficiary: false,
}

export const ExhaustedCredit = Template.bind({})
ExhaustedCredit.args = {
  domainsCredit: domains_exhausted_credit_v1,
  isUserUnderageBeneficiary: false,
}

export const WithOnlyDigitalRestriction = Template.bind({})
WithOnlyDigitalRestriction.args = {
  domainsCredit: domains_credit_v2,
  isUserUnderageBeneficiary: false,
}

export const IsUserUnderageBeneficiary = Template.bind({})
IsUserUnderageBeneficiary.args = {
  domainsCredit: domains_credit_underage,
  isUserUnderageBeneficiary: true,
}

export const IsUserUnderageBeneficiaryExhaustedCredit = Template.bind({})
IsUserUnderageBeneficiaryExhaustedCredit.args = {
  domainsCredit: domains_exhausted_credit_underage,
  isUserUnderageBeneficiary: true,
}
