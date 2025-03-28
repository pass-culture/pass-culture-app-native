import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'

import { theme } from 'theme'
import { Typo } from 'ui/theme'

import { IntersectionObserver } from './IntersectionObserver'

const meta: Meta<typeof IntersectionObserver> = {
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

type Story = StoryObj<typeof IntersectionObserver>

const IntersectionObserverTemplate = (props: React.ComponentProps<typeof IntersectionObserver>) => {
  const [inView, setInView] = useState<boolean>(false)

  const handleChange = (inView: boolean) => {
    setInView(inView)
    action('visibility change')(inView)
  }

  return (
    <IntersectionObserverScrollView style={styles.scrollView}>
      <View style={styles.stateObserverView}>
        <Typo.BodyAccentXs>
          {inView ? 'Observer visible' : 'Observer not visible'} - scroll to test
        </Typo.BodyAccentXs>
      </View>
      <IntersectionObserver onChange={handleChange} threshold={props.threshold}>
        <View style={styles.observerView}>
          <Typo.BodyAccentXs>The observer</Typo.BodyAccentXs>
        </View>
      </IntersectionObserver>
    </IntersectionObserverScrollView>
  )
}

export const WithoutThreshold: Story = {
  render: (props) => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: 0,
  },
}

export const WithPercentThreshold: Story = {
  render: (props) => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: '50%',
  },
}

export const WithNumberThreshold: Story = {
  render: (props) => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: 20,
  },
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
