import { action } from '@storybook/addon-actions'
import { ComponentStory, Meta } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Typo } from 'ui/theme'

import { SelectableListItem } from './SelectableListItem'

export default {
  title: 'features/offer/SelectableListItem',
  component: SelectableListItem,
  parameters: {
    docs: {
      description: {
        component: 'This is a wrapper that creates a box with a radio button and renders anything.',
      },
    },
  },
  argTypes: {
    onSelect: { control: { disable: true } },
  },
} as Meta<typeof SelectableListItem>

const Template: ComponentStory<typeof SelectableListItem> = (props) => (
  <SelectableListItem {...props} />
)

const WrappedTemplate: ComponentStory<typeof SelectableListItem> = (props) => (
  <View style={styles.wrapper}>
    <SelectableListItem {...props} />
  </View>
)

export const Default = Template.bind({})
Default.args = {
  render: () => <Typo.Body>Hello World</Typo.Body>,
  isSelected: false,
  onSelect: action('select'),
}

export const Selected = Template.bind({})
Selected.args = {
  render: () => <Typo.Body>Hello World</Typo.Body>,
  isSelected: true,
  onSelect: action('select'),
}
Selected.parameters = {
  docs: {
    description: {
      story:
        'When selected, it activates the radio button and makes the border bigger.\n\n' +
        'It is just an example to demonstrate what is possible.',
    },
  },
}

export const FunkyContentBasedOnState = Template.bind({})
FunkyContentBasedOnState.args = {
  render: ({ isSelected, isHover }) => (
    <Typo.Body
      style={{
        ...(isSelected && { color: 'red' }),
        ...(isHover && { fontSize: 24 }),
      }}>
      Hello World
    </Typo.Body>
  ),
  isSelected: true,
  onSelect: action('select'),
}
FunkyContentBasedOnState.parameters = {
  docs: {
    description: {
      story: 'When selected, it activates the radio button and makes the border bigger.',
    },
  },
}

export const Wrapped = WrappedTemplate.bind({})
Wrapped.args = {
  render: () => <Typo.Body>Hello World</Typo.Body>,
  isSelected: false,
  onSelect: action('select'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
