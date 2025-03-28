import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { UnderageBlockDescription } from './UnderageBlockDescription'

const meta: Meta<typeof UnderageBlockDescription> = {
  title: 'features/tutorial/UnderageBlockDescription',
  component: UnderageBlockDescription,
}
export default meta

type Story = StoryObj<typeof UnderageBlockDescription>

export const Default: Story = {
  render: () => (
    <GreyContainer>
      <UnderageBlockDescription />
    </GreyContainer>
  ),
  name: 'UnderageBlockDescription',
}

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))
