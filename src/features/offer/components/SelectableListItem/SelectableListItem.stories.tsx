import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Typo } from 'ui/theme'

import { SelectableListItem } from './SelectableListItem'

export default {
  title: 'features/offer/SelectableListItem',
  component: SelectableListItem,
}

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
  render: ({ isSelected }) => (
    <Typo.Body style={isSelected ? styles.selectedText : styles.text}>Hello World</Typo.Body>
  ),
  isSelected: false,
  onSelect: action('select'),
}

export const Wrapped = WrappedTemplate.bind({})
Wrapped.args = {
  render: ({ isSelected }) => (
    <Typo.Body style={isSelected ? styles.selectedText : styles.text}>Hello World</Typo.Body>
  ),
  isSelected: false,
  onSelect: action('select'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
  // eslint-disable-next-line react-native/no-color-literals
  selectedText: {
    color: 'red',
  },
  // eslint-disable-next-line react-native/no-color-literals
  text: {
    color: 'black',
  },
})
