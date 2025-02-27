import { StoryObj, Meta } from '@storybook/react'
import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer, TypoDS } from 'ui/theme'

import { ContentHeader } from './ContentHeader'

const meta: Meta<typeof ContentHeader> = {
  title: 'ui/headers/AnimatedBlurHeaderTitle',
  component: ContentHeader,
  parameters: {
    axe: {
      // We ignore this rule as the error is caused by the implementation of the story and not the component itself
      // The accessibility of this header is already tested in all pages using it
      disabledRules: ['scrollable-region-focusable'],
    },
  },
}
export default meta

const Template: StoryObj<typeof ContentHeader> = (props) => {
  const { onScroll, headerTransition } = useOpacityTransition()

  const headerHeight = useGetHeaderHeight()

  return (
    <Container>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <View style={{ height: headerHeight }} />
        <TypoDS.Title3>{props.headerTitle}</TypoDS.Title3>
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
        <Content />
        <Spacer.Column numberOfSpaces={10} />
      </ScrollView>
      <ContentHeader {...props} headerTransition={headerTransition} />
    </Container>
  )
}

//TODO(PC-28526): Fix this stories
const Default = Template.bind({})
Default.args = {
  headerTitle: 'Titre',
}

const Container = styled.View({ height: 400 })

const Content = styled.View({ height: 200, backgroundColor: 'blue' })
