import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/tutorial/enums'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { AgeCreditBlock } from './AgeCreditBlock'

const ANIMATION_DELAY = 2
const meta: Meta<typeof AgeCreditBlock> = {
  title: 'features/tutorial/AgeCreditBlock',
  component: AgeCreditBlock,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DELAY },
  },
}
export default meta

type Story = StoryObj<typeof AgeCreditBlock>

const ListContainer = styled.View({
  padding: getSpacing(6),
  justifyContent: 'center',
})

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.secondary,
}))

export const OngoingCredit: Story = {
  render: (props) => <AgeCreditBlock {...props} />,
  args: {
    age: 18,
    creditStatus: CreditStatus.ONGOING,
    children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
  },
}

export const withDescription: Story = {
  render: (props) => <AgeCreditBlock {...props} />,
  args: {
    children: (
      <React.Fragment>
        <Typo.Title3>300&nbsp;€</Typo.Title3>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Body>Tu auras 2 ans pour utiliser tes 300&nbsp;€</Typo.Body>
      </React.Fragment>
    ),
    age: 18,
    creditStatus: CreditStatus.COMING,
  },
}

export const CreditBlockList: Story = {
  render: (props) => (
    <ListContainer>
      <AgeCreditBlock {...props} creditStatus={CreditStatus.GONE}>
        <Typo.Title3>30&nbsp;€</Typo.Title3>
      </AgeCreditBlock>
      <Spacer.Column numberOfSpaces={0.5} />
      <AgeCreditBlock {...props} />
      <Spacer.Column numberOfSpaces={0.5} />
      <AgeCreditBlock {...props} creditStatus={CreditStatus.COMING}>
        <Typo.Title3>30&nbsp;€</Typo.Title3>
      </AgeCreditBlock>
    </ListContainer>
  ),
  args: {
    children: <StyledTitle3>30&nbsp;€</StyledTitle3>,
    age: 17,
    creditStatus: CreditStatus.ONGOING,
  },
}
