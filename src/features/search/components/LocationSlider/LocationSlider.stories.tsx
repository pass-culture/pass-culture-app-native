import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import {
  LocationSlider,
  LocationSliderProps,
} from 'features/search/components/LocationSlider/LocationSlider'

export default {
  title: 'features/search/LocationSlider',
  component: LocationSlider,
}

const Template: ComponentStory<typeof LocationSlider> = (props: LocationSliderProps) => (
  <LocationSlider {...props} />
)

const WrappedTemplate: ComponentStory<typeof LocationSlider> = (props) => (
  <View style={styles.wrapper}>
    <Template {...props} />
  </View>
)

export const Default = WrappedTemplate.bind({})
Default.args = {
  defaultValue: 50,
  onChange: action('value changed'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
