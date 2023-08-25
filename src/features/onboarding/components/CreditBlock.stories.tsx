import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const ANIMATION_DELAY = 2
const meta: ComponentMeta<typeof CreditBlock> = {
  title: 'features/onboarding/CreditBlock',
  component: CreditBlock,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DELAY },
  },
}
export default meta

const Template: ComponentStory<typeof CreditBlock> = (props) => <CreditBlock {...props} />
const List: ComponentStory<typeof CreditBlock> = (props) => (
  <ListContainer>
    <CreditBlock
      {...props}
      creditStatus={CreditStatus.GONE}
      title={<Typo.Title3>30&nbsp;€</Typo.Title3>}
    />
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock {...props} />
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock
      {...props}
      creditStatus={CreditStatus.COMING}
      title={<Typo.Title3>30&nbsp;€</Typo.Title3>}
    />
  </ListContainer>
)

const ListContainer = styled.View({
  padding: getSpacing(6),
  justifyContent: 'center',
})

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.secondary,
}))

export const OngoingCredit = Template.bind({})
OngoingCredit.args = {
  title: <StyledTitle3>300&nbsp;€</StyledTitle3>,
  age: 18,
  creditStatus: CreditStatus.ONGOING,
}

export const ComingCredit = Template.bind({})
ComingCredit.args = {
  title: <Typo.Title3>300&nbsp;€</Typo.Title3>,
  age: 18,
  creditStatus: CreditStatus.COMING,
}

export const GoneCredit = Template.bind({})
GoneCredit.args = {
  title: <Typo.Title3>30&nbsp;€</Typo.Title3>,
  age: 17,
  creditStatus: CreditStatus.GONE,
}

export const withDescription = Template.bind({})
withDescription.args = {
  title: <Typo.Title3>300&nbsp;€</Typo.Title3>,
  age: 18,
  description: 'Tu auras 2 ans pour utiliser tes 300\u00a0€',
  creditStatus: CreditStatus.COMING,
}

export const CreditBlockList = List.bind({})
CreditBlockList.args = {
  title: <StyledTitle3>30&nbsp;€</StyledTitle3>,
  age: 17,
  creditStatus: CreditStatus.ONGOING,
}
