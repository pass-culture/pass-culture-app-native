import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Slider } from './Slider'

export default {
  title: 'ui/inputs/Slider',
  component: Slider,
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = (props) => <Slider {...props} />

export const DefaultSlider = Template.bind({})

export const SliderWithValues = Template.bind({})
SliderWithValues.args = {
  values: [100],
  max: 300,
  showValues: true,
}

export const SliderWithMinMaxValues = Template.bind({})
SliderWithMinMaxValues.args = {
  values: [50],
  max: 100,
  showValues: false,
  shouldShowMinMaxValues: true,
}

export const SliderWithFormattedValues = Template.bind({})
SliderWithFormattedValues.args = {
  values: [50],
  min: 20,
  showValues: true,
  formatValues: (n) => `${n} km`,
}

export const SliderWithCustomStep = Template.bind({})
SliderWithCustomStep.args = {
  values: [50],
  min: 20,
  step: 10,
  showValues: true,
}

export const Multislider = Template.bind({})
Multislider.args = {
  values: [0, 75],
  showValues: true,
  formatValues: (n) => `${n}\u00a0€`,
}

export const MultisliderWithOverlap = Template.bind({})
MultisliderWithOverlap.args = {
  values: [50, 50],
  showValues: true,
  formatValues: (n) => `${n}\u00a0€`,
}
