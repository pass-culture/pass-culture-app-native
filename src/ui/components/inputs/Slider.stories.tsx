/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Slider } from './Slider'

const meta: ComponentMeta<typeof Slider> = {
  title: 'ui/inputs/Slider',
  component: Slider,
}
export default meta

const Template: ComponentStory<typeof Slider> = (props) => (
  <div style={{ width: '1024px', backgroundColor: 'grey' }}>
    <Slider {...props} />
  </div>
)

const TemplateWrapped: ComponentStory<typeof Slider> = (props) => (
  // eslint-disable-next-line react-native/no-inline-styles
  <div style={{ width: '375px', backgroundColor: 'lightGrey' }}>
    <Slider {...props} />
  </div>
)

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
  minMaxValuesComplement: `\u00a0km`,
}

export const MobileSliderWithMinMaxValues = TemplateWrapped.bind({})
MobileSliderWithMinMaxValues.args = {
  values: [50],
  max: 100,
  showValues: false,
  shouldShowMinMaxValues: true,
  minMaxValuesComplement: `\u00a0km`,
  sliderLength: 375,
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
