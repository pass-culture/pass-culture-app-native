import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import {
  domains_credit_underage,
  domains_credit_v1,
  domains_credit_v2,
  domains_exhausted_credit_underage,
  domains_exhausted_credit_v1,
} from 'features/profile/components/headers/fixtures/domainsCredit'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

export default {
  title: 'Features/Profile/BeneficiaryCeilings',
  component: BeneficiaryCeilings,
} as ComponentMeta<typeof BeneficiaryCeilings>

const Template: ComponentStory<typeof BeneficiaryCeilings> = (args) => (
  <BeneficiaryCeilings {...args} />
)

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
