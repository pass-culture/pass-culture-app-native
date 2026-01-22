import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'
import styled from 'styled-components/native'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { SelectableListItem } from './SelectableListItem'

const meta: Meta<typeof SelectableListItem> = {
  title: 'features/offer/SelectableListItem',
  component: SelectableListItem,

  argTypes: {
    onSelect: { control: { disable: true } },
  },
}
export default meta

const variantConfig: Variants<typeof SelectableListItem> = [
  {
    label: 'SelectableListItem default',
    props: {
      render: () => <Typo.Body>Hello World</Typo.Body>,
      isSelected: false,
      onSelect: action('select'),
    },
  },
  {
    label: 'SelectableListItem selected',
    props: {
      render: () => <Typo.Body>Hello World</Typo.Body>,
      isSelected: true,
      onSelect: action('select'),
    },
  },
  {
    label: 'SelectableListItem funky content based on state',
    props: {
      render: () => <StyledBody>Hello World</StyledBody>,
      isSelected: true,
      onSelect: action('select'),
    },
  },
]

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
  fontSize: theme.designSystem.size.spacing.xl,
}))

export const Template: VariantsStory<typeof SelectableListItem> = {
  name: 'SelectableListItem',
  render: () => <VariantsTemplate variants={variantConfig} Component={SelectableListItem} />,
}
