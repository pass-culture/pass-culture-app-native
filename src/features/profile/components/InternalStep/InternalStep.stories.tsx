import { ComponentMeta } from '@storybook/react'
import { Story } from '@storybook/react/dist/ts3.9/client/preview/types-6-0'
import React, { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'

import { Typo } from 'ui/theme'

import { StepVariant } from '../VerticalStepper/types'

import { InternalStep } from './InternalStep'

export default {
  title: 'features/profile/InternalStep',
  component: InternalStep,
  argTypes: {},
} as ComponentMeta<typeof InternalStep>

const Template: Story<ComponentProps<typeof InternalStep>> = (props) => <InternalStep {...props} />

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
