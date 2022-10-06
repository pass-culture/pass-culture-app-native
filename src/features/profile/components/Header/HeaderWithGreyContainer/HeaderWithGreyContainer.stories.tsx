import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import { CreditInfo } from 'features/profile/components/CreditInfo/CreditInfo'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { beneficiaryUser } from 'fixtures/user'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { Typo } from 'ui/theme'

import { HeaderWithGreyContainer } from './HeaderWithGreyContainer'

export default {
  title: 'features/Profile/HeaderWithGreyContainer',
  component: HeaderWithGreyContainer,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof HeaderWithGreyContainer>

const Template: ComponentStory<typeof HeaderWithGreyContainer> = (props) => (
  <HeaderWithGreyContainer {...props} />
)

export const WithTitle = Template.bind({})
WithTitle.args = {
  title: 'Jean Dubois',
}

export const WithStringSubtitle = Template.bind({})
WithStringSubtitle.args = {
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
}

const Subtitle = () => (
  <Row>
    <Typo.Body>Profite de ton crédit jusqu’au&nbsp;</Typo.Body>
    <Typo.ButtonText>{formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')}</Typo.ButtonText>
  </Row>
)
const Row = styled.View({ flexDirection: 'row', flexWrap: 'wrap' })

export const WithJSXSubtitle = Template.bind({})
WithJSXSubtitle.args = {
  title: 'Jean Dubois',
  subtitle: <Subtitle />,
}

const Content = () => (
  <React.Fragment>
    <Typo.Body>Crée-toi un compte pour bénéficier de ton crédit pass Culture</Typo.Body>
    {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
    <CreditInfo totalCredit={beneficiaryUser.domainsCredit!.all} />
    <BeneficiaryCeilings domainsCredit={domains_credit_v1} isUserUnderageBeneficiary={false} />
  </React.Fragment>
)

export const WithContent = Template.bind({})
WithContent.args = {
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  content: <Content />,
}
