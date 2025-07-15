import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/enums'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

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

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const variantConfig: Variants<typeof AgeCreditBlock> = [
  {
    label: 'AgeCreditBlock COMING',
    props: {
      age: 18,
      creditStatus: CreditStatus.COMING,
      children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
    },
  },
  {
    label: 'AgeCreditBlock GONE',
    props: {
      age: 18,
      creditStatus: CreditStatus.GONE,
      children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
    },
  },
  {
    label: 'AgeCreditBlock ONGOING',
    props: {
      age: 18,
      creditStatus: CreditStatus.ONGOING,
      children: <StyledTitle3>300&nbsp;€</StyledTitle3>,
    },
  },
]

export const Template: VariantsStory<typeof AgeCreditBlock> = {
  name: 'AgeCreditBlock',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={AgeCreditBlock} defaultProps={props} />
  ),
}
