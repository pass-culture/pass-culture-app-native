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

const WrappedTemplate: ComponentStory<typeof LocationSlider> = (props: LocationSliderProps) => (
  <View style={styles.wrapper}>
    <LocationSlider {...props} />
  </View>
)

export const Default = WrappedTemplate.bind({})
Default.args = {
  defaultValue: 50,
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
