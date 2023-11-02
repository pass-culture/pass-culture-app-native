import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'

import { theme } from 'theme'
import { Typo } from 'ui/theme'

import { IntersectionObserver } from './IntersectionObserver'

const meta: ComponentMeta<typeof IntersectionObserver> = {
  title: 'features/shared/IntersectionObserver',
  component: IntersectionObserver,
  parameters: {
    axe: {
      // We ignore this rule as the error is caused by the implementation of the story and not the component itself
      disabledRules: ['scrollable-region-focusable'],
    },
  },
}
export default meta

const Template: ComponentStory<typeof IntersectionObserver> = (props) => {
  const [inView, setInView] = useState<boolean>(false)

  const handleChange = (inView: boolean) => {
    setInView(inView)
    action('visibility change')(inView)
  }

  return (
    <IOScrollView style={styles.scrollView}>
      <View style={styles.stateObserverView}>
        <Typo.Caption>
          {inView ? 'Observer visible' : 'Observer not visible'} - scroll to test
        </Typo.Caption>
      </View>
      <IntersectionObserver onChange={handleChange} threshold={props.threshold}>
        <View style={styles.observerView}>
          <Typo.Caption>The observer</Typo.Caption>
        </View>
      </IntersectionObserver>
    </IOScrollView>
  )
}

export const WithoutThreshold = Template.bind({})
WithoutThreshold.args = {
  threshold: 0,
}

export const WithPercentThreshold = Template.bind({})
WithPercentThreshold.args = {
  threshold: '50%',
}

export const WithNumberThreshold = Template.bind({})
WithNumberThreshold.args = {
  threshold: 20,
}

const styles = StyleSheet.create({
  scrollView: {
    height: 200,
  },
  stateObserverView: {
    height: 220,
    justifyContent: 'center',
    backgroundColor: theme.colors.greyLight,
  },
  observerView: {
    height: 100,
    backgroundColor: theme.colors.attention,
  },
})
