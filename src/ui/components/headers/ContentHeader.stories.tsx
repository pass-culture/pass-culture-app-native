import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { Typo } from 'ui/theme'

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
const Content = styled.View(({ theme }) => ({
  height: 200,
  backgroundColor: 'blue',
  marginBottom: theme.designSystem.size.spacing.xxxl,
}))
