import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/tutorial/enums'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

import { AgeCreditBlock } from './AgeCreditBlock'

const ANIMATION_DELAY = 2
const meta: ComponentMeta<typeof AgeCreditBlock> = {
  title: 'features/tutorial/AgeCreditBlock',
  component: AgeCreditBlock,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DELAY },
  },
}
export default meta

const Template: ComponentStory<typeof AgeCreditBlock> = (props) => <AgeCreditBlock {...props} />
const List: ComponentStory<typeof AgeCreditBlock> = (props) => (
  <ListContainer>
    <AgeCreditBlock {...props} creditStatus={CreditStatus.GONE}>
      <TypoDS.Title3>30&nbsp;€</TypoDS.Title3>
    </AgeCreditBlock>
    <Spacer.Column numberOfSpaces={0.5} />
    <AgeCreditBlock {...props} />
    <Spacer.Column numberOfSpaces={0.5} />
    <AgeCreditBlock {...props} creditStatus={CreditStatus.COMING}>
      <TypoDS.Title3>30&nbsp;€</TypoDS.Title3>
    </AgeCreditBlock>
  </ListContainer>
)

const ListContainer = styled.View({
  padding: getSpacing(6),
  justifyContent: 'center',
})

const StyledTitle3 = styled(TypoDS.Title3)(({ theme }) => ({
  color: theme.colors.secondary,
}))

//TODO(PC-28526): Fix this stories
const OngoingCredit = Template.bind({})
OngoingCredit.args = {
  age: 18,
  creditStatus: CreditStatus.ONGOING,
  children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
}

//TODO(PC-28526): Fix this stories
const withDescription = Template.bind({})
withDescription.args = {
  children: (
    <React.Fragment>
      <TypoDS.Title3>300&nbsp;€</TypoDS.Title3>
      <Spacer.Column numberOfSpaces={2} />
      <TypoDS.Body>Tu auras 2 ans pour utiliser tes 300&nbsp;€</TypoDS.Body>
    </React.Fragment>
  ),
  age: 18,
  creditStatus: CreditStatus.COMING,
}

//TODO(PC-28526): Fix this stories
const CreditBlockList = List.bind({})
CreditBlockList.args = {
  children: <StyledTitle3>30&nbsp;€</StyledTitle3>,
  age: 17,
  creditStatus: CreditStatus.ONGOING,
}
