import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer, Typo } from 'ui/theme'

import { AnimatedBlurHeaderTitle } from './AnimatedBlurHeader'

const meta: ComponentMeta<typeof AnimatedBlurHeaderTitle> = {
  title: 'ui/headers/AnimatedBlurHeaderTitle',
  component: AnimatedBlurHeaderTitle,
  parameters: {
    axe: {
      // We ignore this rule as the error is caused by the implementation of the story and not the component itself
      // The accessibility of this header is already tested in all pages using it
      disabledRules: ['scrollable-region-focusable'],
    },
  },
}
export default meta

const Template: ComponentStory<typeof AnimatedBlurHeaderTitle> = (props) => {
  const { onScroll, headerTransition } = useOpacityTransition()

  const headerHeight = useGetHeaderHeight()

  return (
    <Container>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <View style={{ height: headerHeight }} />
        <Typo.Title3>{props.headerTitle}</Typo.Title3>
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
      </ScrollView>
      <AnimatedBlurHeaderTitle {...props} headerTransition={headerTransition} />
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {
  headerTitle: 'Titre',
}

const Container = styled.View({ height: 400 })

const Content = styled.View({ height: 200, backgroundColor: 'blue' })
