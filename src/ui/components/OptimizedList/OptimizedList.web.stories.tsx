/* eslint-disable @typescript-eslint/no-explicit-any */

import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

import { OptimizedList } from './OptimizedList.web'
import { OnLayoutProps, RenderItemProps } from './types'
import { generateItems } from './utils'

const meta: ComponentMeta<typeof OptimizedList> = {
  title: 'ui/OptimizedList - Web',
  component: OptimizedList,
  argTypes: {
    items: { control: { disable: true } },
    headerComponent: { control: { disable: true }, defaultValue: undefined },
    footerComponent: { control: { disable: true }, defaultValue: undefined },
    renderItem: { control: { disable: true } },
    onRefresh: { control: { disable: true }, defaultValue: undefined },
  },
}

export default meta

type Story = ComponentStory<typeof OptimizedList>

const Wrapper = styled.View({
  height: 400,
  overflow: 'hidden',
})

const Header = styled(View)(({ theme }) => ({
  height: 80,
  backgroundColor: theme.colors.greyLight,
}))

const Footer = styled(View)(({ theme }) => ({
  height: 50,
  backgroundColor: theme.colors.greyLight,
}))

const Item = styled.View({
  height: 100,
})

const Template: Story = (args) => (
  <Wrapper>
    <OptimizedList {...args} />
  </Wrapper>
)

function HeaderWithDeterminedHeight({ onLayout }: OnLayoutProps) {
  return (
    <Header onLayout={onLayout}>
      <Typo.Body>Hello world!</Typo.Body>
    </Header>
  )
}

function HeaderWithDynamicHeight({ onLayout }: OnLayoutProps) {
  const [height, setHeight] = useState(10)

  useEffect(() => {
    setTimeout(setHeight, 1000, 200)
  }, [])

  return (
    <Header onLayout={onLayout} style={{ height }}>
      <Typo.Body>Hello world!</Typo.Body>
    </Header>
  )
}

function FooterWithDeterminedHeight({ onLayout }: OnLayoutProps) {
  return (
    <Footer onLayout={onLayout}>
      <Typo.Body>Hello World!</Typo.Body>
    </Footer>
  )
}

export const WithoutHeaderNorFooter = Template.bind({})
WithoutHeaderNorFooter.args = {
  itemSize: 100,
  items: generateItems(20),
  refreshing: false,
  onRefresh: action('refresh'),
  // @ts-expect-error Storybook is not excellent at handling generic components...
  renderItem: ({ item }: RenderItemProps) => {
    return (
      <Item key={item.name}>
        <Typo.Body>{item.name}</Typo.Body>
      </Item>
    )
  },
}
WithoutHeaderNorFooter.argTypes = {
  headerComponent: { table: { disable: true } },
  footerComponent: { table: { disable: true } },
}

export const WithHeader = Template.bind({})
WithHeader.args = {
  ...WithoutHeaderNorFooter.args,
  headerComponent: HeaderWithDeterminedHeight,
}
WithHeader.argTypes = {
  footerComponent: { table: { disable: true } },
}

export const WithHeaderWithDynamicSize = Template.bind({})
WithHeaderWithDynamicSize.args = {
  ...WithHeader.args,
  headerComponent: HeaderWithDynamicHeight,
}

export const WithFooter = Template.bind({})
WithFooter.args = {
  ...WithoutHeaderNorFooter.args,
  footerComponent: FooterWithDeterminedHeight,
}
WithFooter.argTypes = {
  headerComponent: { table: { disable: true } },
}

export const WithHeaderAndFooter = Template.bind({})
WithHeaderAndFooter.args = {
  ...WithoutHeaderNorFooter.args,
  ...WithHeader.args,
  ...WithFooter.args,
}

export const WithOnEndReached = Template.bind({})
WithOnEndReached.args = {
  ...WithHeaderAndFooter.args,
  onEndReached: action('end reached'),
  endReachedThreshold: 0,
}

const additionalData = {
  backgroundColor: '#fff200',
} as const
export const WithAdditionalData = Template.bind({})
WithAdditionalData.args = {
  ...WithHeaderAndFooter.args,
  additionalData,
  // @ts-expect-error Storybook is not excellent at handling generic components...
  renderItem: ({
    item,
    data,
  }: RenderItemProps<ReturnType<typeof generateItems>[number], typeof additionalData>) => {
    return (
      <Item style={{ backgroundColor: data.backgroundColor }} key={item.name}>
        <Typo.Body>{item.name}</Typo.Body>
      </Item>
    )
  },
}
