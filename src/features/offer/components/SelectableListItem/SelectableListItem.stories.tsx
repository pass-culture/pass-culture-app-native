import { action } from 'storybook/actions'
import type { Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
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
      render: () => (
        <Typo.Body
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            color: theme.colors.primary,
            fontSize: 24,
          }}>
          Hello World
        </Typo.Body>
      ),
      isSelected: true,
      onSelect: action('select'),
    },
  },
]

export const Template: VariantsStory<typeof SelectableListItem> = {
  name: 'SelectableListItem',
  render: () => <VariantsTemplate variants={variantConfig} Component={SelectableListItem} />,
}
