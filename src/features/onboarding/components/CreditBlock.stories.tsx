import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'
import { getSpacing, Spacer } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

export default {
  title: 'features/onboarding/CreditBlock',
  component: CreditBlock,
} as ComponentMeta<typeof CreditBlock>

const Template: ComponentStory<typeof CreditBlock> = (props) => <CreditBlock {...props} />
const List: ComponentStory<typeof CreditBlock> = (props) => (
  <ListContainer>
    <CreditBlock {...props} position="top" creditStatus={CreditStatus.GONE} />
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock {...props} />
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock {...props} position="bottom" creditStatus={CreditStatus.COMING} />
  </ListContainer>
)

const ListContainer = styled.View({
  padding: getSpacing(6),
  justifyContent: 'center',
  alignItems: 'center',
})

const eighteenYearOldProps = {
  underage: false,
  title: '300\u00a0€',
  subtitle: 'à 18 ans',
  description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€',
  position: undefined,
  creditStatus: CreditStatus.ONGOING,
}

const underageProps = {
  underage: true,
  title: '20\u00a0€',
  subtitle: 'à 15 ans',
  position: undefined,
  creditStatus: CreditStatus.ONGOING,
}

export const Eighteen = Template.bind({})
Eighteen.args = eighteenYearOldProps

export const YoungerThanEighteen = Template.bind({})
YoungerThanEighteen.args = { ...eighteenYearOldProps, creditStatus: CreditStatus.COMING }

export const OlderThanEighteen = Template.bind({})
OlderThanEighteen.args = { ...eighteenYearOldProps, creditStatus: CreditStatus.GONE }

export const Underage = Template.bind({})
Underage.args = underageProps

export const YoungerThanUnderage = Template.bind({})
YoungerThanUnderage.args = {
  ...underageProps,
  creditStatus: CreditStatus.COMING,
}

export const OlderThanUnderage = Template.bind({})
OlderThanUnderage.args = {
  ...underageProps,
  creditStatus: CreditStatus.GONE,
}

export const CreditBlockList = List.bind({})
CreditBlockList.args = underageProps
