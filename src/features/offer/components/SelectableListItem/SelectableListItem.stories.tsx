import { action } from '@storybook/addon-actions'
import { ComponentStory, Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const variantConfig = [
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

const Template: ComponentStory<typeof SelectableListItem> = () => (
  <VariantsTemplate variants={variantConfig} Component={SelectableListItem} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SelectableListItem'
