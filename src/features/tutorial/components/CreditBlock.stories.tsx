import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/tutorial/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const ANIMATION_DELAY = 2
const meta: ComponentMeta<typeof CreditBlock> = {
  title: 'features/tutorial/CreditBlock',
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
    <CreditBlock {...props} creditStatus={CreditStatus.GONE}>
      <Typo.Title3>30&nbsp;€</Typo.Title3>
    </CreditBlock>
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock {...props} />
    <Spacer.Column numberOfSpaces={0.5} />
    <CreditBlock {...props} creditStatus={CreditStatus.COMING}>
      <Typo.Title3>30&nbsp;€</Typo.Title3>
    </CreditBlock>
  </ListContainer>
)

const ListContainer = styled.View({
  padding: getSpacing(6),
  justifyContent: 'center',
})

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const StyledBody = styled(Typo.Body)({
  marginVertical: getSpacing(2),
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})

export const OngoingCredit = Template.bind({})
OngoingCredit.args = {
  age: 18,
  creditStatus: CreditStatus.ONGOING,
  children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
}

export const ComingCredit = Template.bind({})
ComingCredit.args = {
  children: <Typo.Title3>300&nbsp;€</Typo.Title3>,
  age: 18,
  creditStatus: CreditStatus.COMING,
}

export const GoneCredit = Template.bind({})
GoneCredit.args = {
  children: <Typo.Title3>30&nbsp;€</Typo.Title3>,
  age: 17,
  creditStatus: CreditStatus.GONE,
}

export const withDescription = Template.bind({})
withDescription.args = {
  children: (
    <React.Fragment>
      <Typo.Title3>300&nbsp;€</Typo.Title3>
      <Spacer.Column numberOfSpaces={2} />
      <StyledBody>Tu auras 2 ans pour utiliser tes 300\u00a0€</StyledBody>
    </React.Fragment>
  ),
  age: 18,
  creditStatus: CreditStatus.COMING,
}

export const CreditBlockList = List.bind({})
CreditBlockList.args = {
  children: <StyledTitle3>30&nbsp;€</StyledTitle3>,
  age: 17,
  creditStatus: CreditStatus.ONGOING,
}
