import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { Typo, getSpacing } from 'ui/theme'

import { ContentHeader } from './ContentHeader'

const meta: Meta<typeof ContentHeader> = {
  title: 'ui/headers/ContentHeader',
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

type Story = StoryObj<typeof ContentHeader>

const StoryComponent = (props: React.ComponentProps<typeof ContentHeader>) => {
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()

  return (
    <IconFactoryProvider>
      <Container>
        <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
          <View style={{ height: headerHeight }} />
          <Typo.Title3>{props.headerTitle}</Typo.Title3>
          <Content />
          <Content />
          <Content />
          <Content />
        </ScrollView>
        <ContentHeader {...props} headerTransition={headerTransition} />
      </Container>
    </IconFactoryProvider>
  )
}

export const Default: Story = {
  name: 'ContentHeader',
  render: (props) => <StoryComponent {...props} />,
  args: {
    headerTitle: 'Titre',
  },
}

const Container = styled.View({ height: 400 })
const Content = styled.View({ height: 200, backgroundColor: 'blue', marginBottom: getSpacing(10) })
