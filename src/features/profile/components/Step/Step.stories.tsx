import { ComponentMeta } from '@storybook/react'
import { Story } from '@storybook/react/dist/ts3.9/client/preview/types-6-0'
import React, { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'

import { Typo } from 'ui/theme'

import { StepVariant } from '../VerticalStepper/types'

import { Step } from './Step'

export default {
  title: 'features/profile/Step',
  component: Step,
  argTypes: {},
} as ComponentMeta<typeof Step>

const Template: Story<ComponentProps<typeof Step>> = (props) => <Step {...props} />

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  exampleWrapper: { flexGrow: 1, backgroundColor: 'red', padding: 24 },
})

export const Complete = Template.bind({})
Complete.args = {
  variant: StepVariant.complete,
  children: (
    <View style={styles.exampleWrapper}>
      <Typo.Body>Example text</Typo.Body>
      <Typo.Body>Example text</Typo.Body>
      <Typo.Body>Example text</Typo.Body>
      <Typo.Body>Example text</Typo.Body>
    </View>
  ),
}

export const InProgress = Template.bind({})
InProgress.args = {
  ...Complete.args,
  variant: StepVariant.in_progress,
}

export const Future = Template.bind({})
Future.args = {
  ...Complete.args,
  variant: StepVariant.future,
}
