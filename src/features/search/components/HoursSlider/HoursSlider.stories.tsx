import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoursSlider, HoursSliderProps } from 'features/search/components/HoursSlider/HoursSlider'

export default {
  title: 'features/search/HoursSlider',
  component: HoursSlider,
}

const Template: ComponentStory<typeof HoursSlider> = (props: HoursSliderProps) => (
  <HoursSlider {...props} />
)

const WrappedTemplate: ComponentStory<typeof HoursSlider> = (props) => (
  <View style={styles.wrapper}>
    <Template {...props} />
  </View>
)

export const Default = WrappedTemplate.bind({})
Default.args = {
  defaultValue: [8, 22],
  onChange: action('value changed'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
